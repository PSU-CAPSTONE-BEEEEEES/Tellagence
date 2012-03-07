clear all;
%this script is for testing exporting data from Matlab into database
%since the number of shortest paths for thousand of users is very large so
%that we need to build this test.

%set up the connection with 'real' database
javaaddpath({'postgresql.jar'});
conn = database('real','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/real');

%get back all of exported data before

%cur = exec(conn,'select * from shortestpaths where user_id>0 and user_id<=1000');
%cur = exec(conn,'select * from shortestpaths where user_id>1000 and user_id<=2000');
%cur = exec(conn,'select * from shortestpaths where user_id>2000 and user_id<=3000');
%cur = exec(conn,'select * from shortestpaths where user_id>3000 and user_id<=4000');
%cur = exec(conn,'select * from shortestpaths where user_id>4000 and user_id<=5000');
cur = exec(conn,'select * from shortestpaths where user_id>5000 and user_id<6000');%test 1000 user_ids each time, since 6000 nodes is out of memory
cur=fetch(cur);
data = cur.Data;

%count and calculate the percentage of correctness
%it is correct when the number of exported shortest path values from 1 user
%to all of other users are correct. Base on the design, the number of
%shortest path from user whose id =x is x-1.
correct_count =0;
for i=1:length(data)
    user_id=data{i,1};
    shortestpaths=data{i,2};
    numberofshortestpaths = length(regexp(shortestpaths,':'))+1;
    if (user_id  == numberofshortestpaths +1)
        correct_count = correct_count+1;
    end
end

fprintf('corrected percentage : %f \n',correct_count/length(data)*100)

close(conn);