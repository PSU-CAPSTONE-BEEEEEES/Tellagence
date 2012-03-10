function [ data ] = importdata()
%IMPORTDATA Summary of this function goes here
%output : all of data in the table relationship in 'fake' database
%(database named 'fake')
%   Detailed explanation goes here
conn = database('fake','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/fake');
cur = exec(conn,'select * from relationship');
cur=fetch(cur);
data = cur.Data;
end

