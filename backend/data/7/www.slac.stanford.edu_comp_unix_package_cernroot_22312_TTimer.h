ifndef root_ttimer define root_ttimer seq copyright t noinclude ttimer handles synchronous and a synchronous timer events to make use of this class one has to sub class ttimer and implement notify and remove if timer has not been added to the gsystem timer list without sub classing one can use the hastimedout method use reset to reset the timer after expiration to disable a timer remove it using remove or destroy it ifndef root_tsysevthandler keep tsysevthandler include tsysevthandler h kend endif ifndef root_ttime keep ttime t c++ include ttime h kend endif ifndef root_tstring keep tstring include tstring h kend endif class ttimer public tsysevthandler protected ttime ftime time out time in ms ttime fabstime absolute time out time in ms bool_t ftimeout true if timer has timed out bool_t fsync true if synchrounous timer uint_t ftimeid the system id of this timer for win32 tobject fobject object to be notified if any tstring fcommand interpreter command to be executed public ttimer long_t millisec bool_t mode ktrue ttimer tobject obj long_t millisec bool_t mode ktrue ttimer const char command long_t millisec bool_t mode ktrue virtual ttimer remove bool_t checktimer const ttime &now const char getcommand const return fcommand data tobject getobject return fobject ttime gettime const return ftime uint_t gettimerid return ftimeid ttime getabstime const return fabstime bool_t hastimedout const return ftimeout bool_t issync const return fsync bool_t isasync const return fsync virtual bool_t notify void remove turnoff void reset void setcommand const char command void setobject tobject object void settime long_t millisec ftime millisec void settimerid uint_t id 0 ftimeid id virtual void turnon virtual void turnoff classdef ttimer 0 handle timer event endif