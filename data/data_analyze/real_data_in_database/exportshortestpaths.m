clear all;
%this script is for performing
%1) perform allshortestpaths algorithm with real data in database
%2) export all of shortest path values into the table shortestpaths in
%database

%set up the connection with the database
javaaddpath({'postgresql.jar'});

shortestpath_adjacency_matrix = createshortestpathadjacencymatrix;
[w h] = size(shortestpath_adjacency_matrix);

conn = database('real','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/real');
tablename = 'shortestpaths';
fieldnames = {'user_id','shortestpath'};

%push lower half of shortest path adjacency matrix to database
for i=2:w %start from 2, because there is no shortest path from 1->1
    shortestpaths = '';
    for j=1:i-1
         shortestpathvalue = shortestpath_adjacency_matrix(i,j);
         if shortestpathvalue == Inf %if there is no shortest path between 2 nodes, then use 0 to indicate that     
            shortestpathvalue = 0; % since distance = 1/ (inf_1to2+inf_2to1), and inf_1to2 + inf_2to1 is always >0
         end 
         shortestpaths = strcat(shortestpaths, strcat(':', num2str(shortestpathvalue)));%shortest path values are separate from :
    end
    if (length(shortestpaths) > 0) %if there are any shortest path values in the string, remove the first : 
        shortestpaths(1)='';
    end
    user_id = i;
    datainsert(conn,tablename, fieldnames,{user_id shortestpaths});
end

close(conn);
