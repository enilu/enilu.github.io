---
layout: post
category : 随手记 
keywords: "c#,mysql,"
description : "想用c#做点桌面应用，可是又不想用sqlserver，准备用mysql，找了些资料，先来个简单的c#连接mysql的例子："
tags : [c#,mysql,入门教程]
---

想用c#做点桌面应用，可是又不想用sqlserver，准备用mysql，找了些资料，先来个简单的连接例子：
首先要下载mysql的的.net驱动，我下的是：mysql-connector-net-5.0.3，下载地址：ftp://gd.tuwien.ac.at/db/mysql/Downloads/Connector-Net/ 这里也可以：http://library.pantek.com/Applications/MySQL/Downloads/Connector-Net/ 
<!--break-->


{% include JB/setup %}

  然后双击安装MySql.Data.msi，安装后会在安装目录中有关bin目录Binaries\.Net2.0\MySql.Data.dll,在建立的c#项目中引用该dll，
测试代码如下：


     using System;
     using System.Collections.Generic;
     using System.Text;
     using MySql.Data.MySqlClient;
    
     namespace testmysql
     {
        class DBUtil
         {
             public static void main(String[] args) {
                new DBUtil().getData("select * from tablename");
            }
             public void getData(String sql){
                 MySqlConnection conn = null;
                 MySqlCommand command = null;
                 MySqlDataReader reader = null;
                 try
                 {
                     conn = new MySqlConnection("Server=localhost;User Id=root;Password=root;Persist Security Info=True;Database=test");
                     command = conn.CreateCommand();
                     command.CommandText = sql;
                     conn.Open();
                     reader = command.ExecuteReader();
                     while (reader.Read())
                     {
                         Console.WriteLine(reader[0]);
                         Console.WriteLine(reader[1]);
                         Console.WriteLine(reader[2]);
                     }
                 }
                 catch (MySqlException se)
                 {
                     Console.WriteLine("Database operation errors : " + se.StackTrace);
                     conn.Close();
                     command = null;
                     reader.Close();
                 }
            }
    
         }
     }

