package cs276.assignments;

import cs276.util.Pair;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.LinkedList;

public class Index {

	// Term id -> (position in index file, doc frequency) dictionary
	private static Map<Integer, Pair<Long, Integer>> postingDict 
		= new TreeMap<Integer, Pair<Long, Integer>>();
	// Doc name -> doc id dictionary
	private static Map<String, Integer> docDict
		= new TreeMap<String, Integer>();
	// Term -> term id dictionary
	private static Map<String, Integer> termDict
		= new TreeMap<String, Integer>();
	// Block queue
	private static LinkedList<File> blockQueue
		= new LinkedList<File>();

	// Total file counter
	private static int totalFileCount = 0;
	// Document counter
	private static int docIdCounter = 0;
	// Term counter
	private static int wordIdCounter = 0;
	// Index
	private static BaseIndex index = null;

	
	/* 
	 * Write a posting list to the given file 
	 * You should record the file position of this posting list
	 * so that you can read it back during retrieval
	 * 
	 * */
	private static void writePosting(FileChannel fc, PostingList posting) throws IOException {
			Pair temp_int = new Pair(fc.position(), posting.getList().size());
			postingDict.put(posting.getTermId(), temp_int);
	}

	public static void main(String[] args) throws IOException {
		/* Parse command line */
		if (args.length != 3) {
			System.err
					.println("Usage: java Index [Basic|VB|Gamma] data_dir output_dir");
			return;
		}

		/* Get index */
		String className = "cs276.assignments." + args[0] + "Index";
		try {
			Class<?> indexClass = Class.forName(className);
			index = (BaseIndex) indexClass.newInstance();
		} catch (Exception e) {
			System.err
					.println("Index method must be \"Basic\", \"VB\", or \"Gamma\"");
			throw new RuntimeException(e);
		}

		/* Get root directory */
		String root = args[1];
		File rootdir = new File(root);
		if (!rootdir.exists() || !rootdir.isDirectory()) {
			System.err.println("Invalid data directory: " + root);
			return;
		}

		/* Get output directory */
		String output = args[2];
		File outdir = new File(output);
		if (outdir.exists() && !outdir.isDirectory()) {
			System.err.println("Invalid output directory: " + output);
			return;
		}

		if (!outdir.exists()) {
			if (!outdir.mkdirs()) {
				System.err.println("Create output directory failure");
				return;
			}
		}

		/* A filter to get rid of all files starting with .*/
		FileFilter filter = new FileFilter() {
			@Override
			public boolean accept(File pathname) {
				String name = pathname.getName();
				return !name.startsWith(".");
			}
		};

		/* BSBI indexing algorithm */
		File[] dirlist = rootdir.listFiles(filter);
		Map<Integer, PostingList> map_of_postingList = new TreeMap<Integer, PostingList>();
		/* For each block */
		for (File block : dirlist) {
			File blockFile = new File(output, block.getName());
			blockQueue.add(blockFile);

			File blockDir = new File(root, block.getName());
			File[] filelist = blockDir.listFiles(filter);
			
			/* For each file */
			for (File file : filelist) {
				++totalFileCount;
				String fileName = block.getName() + "/" + file.getName();
				docDict.put(fileName, docIdCounter++);
				
				BufferedReader reader = new BufferedReader(new FileReader(file));
				String line;
				while ((line = reader.readLine()) != null) {
					String[] tokens = line.trim().split("\\s+");
					for (String token : tokens) {
						if(!termDict.containsKey(token)){
							termDict.put(token, wordIdCounter++);
						}
						System.out.println("token: " + token + " key: " + termDict.get(token));
						int temp = termDict.get(token);
						if(!map_of_postingList.containsKey(temp)) {
							ArrayList<Integer> array_list = new ArrayList<Integer>();
							array_list.add(docDict.get(fileName));
							PostingList new_postingList = new PostingList(temp, array_list);
							map_of_postingList.put(temp, new_postingList);

						} 
						else {
							if(docDict.get(fileName) != map_of_postingList.get(temp).getList().get(map_of_postingList.get(temp).getList().size()-1)) {
								map_of_postingList.get(temp).getList().add(docDict.get(fileName));
							}

						}
						System.out.println(map_of_postingList.get(temp).getList().size());
						System.out.println("Processing token " + token + " for file " + fileName);
					}
				}
				
				reader.close();
			} 

			/* Sort and output */
			if (!blockFile.createNewFile()) {
				System.err.println("Create new block failure.");
				return;
			}
			
			/* Write all posting lists for all terms to file (bfc) */
			RandomAccessFile bfc = new RandomAccessFile(blockFile, "rw");
			FileChannel file_channel = bfc.getChannel();
			for (Map.Entry<Integer, PostingList> map_set: map_of_postingList.entrySet()) {
				writePosting(file_channel, map_set.getValue());
				index.writePosting(file_channel, map_set.getValue());
			}
			bfc.close();
		}

		/* Required: output total number of files. */
		System.out.println(totalFileCount);

		/* Merge blocks */
		while (true) {
			if (blockQueue.size() <= 1)
				break;

			File b1 = blockQueue.removeFirst();
			File b2 = blockQueue.removeFirst();
			
			File combfile = new File(output, b1.getName() + "+" + b2.getName());
			if (!combfile.createNewFile()) {
				System.err.println("Create new block failure.");
				return;
			}

			RandomAccessFile bf1 = new RandomAccessFile(b1, "r");
			RandomAccessFile bf2 = new RandomAccessFile(b2, "r");
			RandomAccessFile mf = new RandomAccessFile(combfile, "rw");
			
			FileChannel f1 = bf1.getChannel();
			FileChannel f2 = bf2.getChannel();
			FileChannel f3 = mf.getChannel();

			PostingList p1 = index.readPosting(f1);
			PostingList p2 = index.readPosting(f2);
			

			while((p1 != null) && (p2 != null)) {
				if(p1.getTermId() > p2.getTermId()) {
					index.writePosting(f3, p2);
					p2 = index.readPosting(f2);
				} else if (p1.getTermId() < p2.getTermId()){
					index.writePosting(f3, p1);
					p1 = index.readPosting(f1);

				} else {
					int i = 0;
					int j = 0;
					ArrayList<Integer> new_list = new ArrayList<Integer>();
					PostingList p3 = new PostingList(p1.getTermId(), new_list);
					while((i < p1.getList().size()) && (j < p2.getList().size())){
						if(p1.getList().get(i) > p2.getList().get(j)){
							new_list.add(p2.getList().get(j));
							j++;
						} else if (p1.getList().get(i) < p2.getList().get(i)){
							new_list.add(p1.getList().get(i));
							i++;
						}
						else {
							new_list.add(p1.getList().get(i));
							i++;
							j++;
						}
					}
					while(i < p1.getList().size()){
						new_list.add(p1.getList().get(i));
						i++;
					}
					while(j < p2.getList().size()){
						new_list.add(p2.getList().get(j));
						j++;
					}
					index.writePosting(f3, p3);
					p1 = index.readPosting(f1);
					p2 = index.readPosting(f2);
				}

			}
			while(p1 != null) {
				index.writePosting(f3, p1);
				p1 = index.readPosting(f1);
			}
			while(p2 != null) {
				index.writePosting(f3, p2);
				p2 = index.readPosting(f2);
			}
			bf1.close();
			bf2.close();
			mf.close();
			b1.delete();
			b2.delete();
			blockQueue.add(combfile);
		}

		/* Dump constructed index back into file system */
		File indexFile = blockQueue.removeFirst();
		indexFile.renameTo(new File(output, "corpus.index"));

		BufferedWriter termWriter = new BufferedWriter(new FileWriter(new File(
				output, "term.dict")));
		for (String term : termDict.keySet()) {
			termWriter.write(term + "\t" + termDict.get(term) + "\n");
		}
		termWriter.close();

		BufferedWriter docWriter = new BufferedWriter(new FileWriter(new File(
				output, "doc.dict")));
		for (String doc : docDict.keySet()) {
			docWriter.write(doc + "\t" + docDict.get(doc) + "\n");
		}
		docWriter.close();

		BufferedWriter postWriter = new BufferedWriter(new FileWriter(new File(
				output, "posting.dict")));
		for (Integer termId : postingDict.keySet()) {
			postWriter.write(termId + "\t" + postingDict.get(termId).getFirst()
					+ "\t" + postingDict.get(termId).getSecond() + "\n");
		}
		postWriter.close();
	}

}
