function [ num_nodes relationship ] = importdata()
%IMPORTDATA Summary of this function goes here
%output : the number of nodes(users), and all of data in the table relationship in the 'real' database
%   Detailed explanation goes here

%connect to database username: postgres, pass: bees, database name: real
conn = database('real','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/real');
cur = exec(conn,'select count(*)from users');%query for the number of nodes (number of rows in users table
cur=fetch(cur); 
num_nodes = cur.Data{1}; %get the number of nodes from the query result

cur = exec(conn,'select * from relationship'); %query for all relationships in relationship table
cur=fetch(cur);
relationship = cur.Data;

close(conn);
end

