require(RMySQL)
require(ggplot2)
require(plotly)
require(RColorBrewer)
require(reshape2)
cols<-brewer.pal(6, "Dark2")
cols<-colorRampPalette(cols)
cols<-cols(7)
Sys.setenv("plotly_username"="F.Hamed")
Sys.setenv("plotly_api_key"="key")

con<-dbConnect(RMySQL::MySQL(), dbname = "battery_diag", username = "batuser", password = "password", host = "domain.com", port = 3306)  
BatteryData<-dbGetQuery(con, "SELECT datetime, soc, pack_voltage, capacity, current, temperature, contact_status from prototype_1")

dbDisconnect(con)
BatteryData[,"datetime"]<-as.POSIXct(strptime(BatteryData[,"datetime"], "%Y-%m-%d %H:%M:%S"))
BatteryData<-BatteryData[1:5000,]

#Potential ggplot2 graphs (not used)
#Graph1<-ggplot(BatteryData, aes(x=datetime, y=soc))+geom_line(colour = cols[1])+theme_minimal()+ggtitle("Status of Charge")+ylab("Percentage")+xlab(paste("Date", "&", "Time"))
#Graph2<-ggplot(BatteryData, aes(x=datetime, y=pack_voltage))+geom_line(colour = cols[2])+theme_minimal()+ggtitle("Pack Voltage")+ylab("Volts")+xlab(paste("Date", "&", "Time"))
#Graph3<-ggplot(BatteryData, aes(x=datetime, y=capacity))+geom_line(colour = cols[3])+theme_minimal()+ggtitle("Capacity")+ylab("Ampere Hours")+xlab(paste("Date", "&", "Time"))
#Graph4<-ggplot(BatteryData, aes(x=datetime, y=current))+geom_line(colour = cols[4])+theme_minimal()+ggtitle("Current")+ylab("Amperes")+xlab(paste("Date", "&", "Time"))
#Graph5<-ggplot(BatteryData, aes(x=datetime, y=temperature))+geom_line(colour = cols[5])+theme_minimal()+ggtitle("Temperature")+ylab("Degrees Celcius")+xlab(paste("Date", "&", "Time"))
#Graph6<-ggplot(BatteryData, aes(x=datetime, y=contact_status))+geom_line(colour = cols[6])+theme_minimal()+ggtitle("Contact status")+ylab("Battery Connections")+xlab(paste("Date", "&", "Time"))
#subplot(Graph1, Graph2, Graph3, Graph4, Graph5, Graph6, nrows = 2, titleX=TRUE, titleY=TRUE) 

#Plotly graphs
 p1 <- plot_ly(BatteryData, x = ~datetime, y = ~soc) %>% 
     add_lines(name = "Charge Status")
 p2 <- plot_ly(BatteryData, x = ~datetime, y = ~pack_voltage) %>% 
     add_lines(name = "Pack Voltage")
 p3<- plot_ly(BatteryData, x = ~datetime, y = ~capacity) %>% 
     add_lines(name = "Capacity")
 p4<- plot_ly(BatteryData, x = ~datetime, y = ~current) %>% 
     add_lines(name = "Current")
 p5<- plot_ly(BatteryData, x = ~datetime, y = ~temperature) %>% 
     add_lines(name = "Temperature")
 p6<- plot_ly(BatteryData, x = ~datetime, y = ~contact_status) %>% 
     add_lines(name = "Contact Status")

MainGraphv2<-subplot(p1,p2,p3,p4,p5,p6, nrows = 2)
