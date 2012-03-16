clear all;
%this script is for performing
%1) perform all shortest path algorithm using fake data in 'fake' database
%2) export shortest path values to the table test2 in the 'fake' database

%set up connection with database
javaaddpath({'postgresql.jar'});
shortestpath_adjacency_matrix = createshortestpathadjacencymatrix;
[w h] = size(shortestpath_adjacency_matrix);

conn = database('fake','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/fake');
tablename = 'test2';
fieldnames = {'user_id','shortestpath'};

%push lower half of shortest path adjacency matrix to database
for i=2:w %start from 2, because there is no shortest path from 1->1
    shortestpaths = '';
    for j=1:i-1
         shortestpathvalue = shortestpath_adjacency_matrix(i,j);
         if shortestpathvalue == Inf %if there is no shortest path between 2 nodes, then use 1 to indicate that     
            shortestpathvalue = 2; % since shortest path value = 1/ (inf_1to2+inf_2to1)
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
