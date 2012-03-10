clear all;
%this script is for performing
%1)call importdata function to get the number of users, and relationship between them from database
%2)call findsubgraphs function to get the number of subgraphs, and the
%subgraph vector(index : user_id, element : subgraph_id)
%3)export data to the subgraph table in 'real' database

javaaddpath({'postgresql.jar'});

%import data, and get the subgraphs vectors
[num_nodes relationships] = importdata;

[num_subgraphs subgraphs] = findsubgraphs(num_nodes, relationships); 

%set up connection to the database
conn = database('real','postgres','bees','org.postgresql.Driver','jdbc:postgresql://capstone06.cs.pdx.edu:5432/real');
tablename = 'subgraphs';
fieldnames = {'subgraph_id','num','user_ids'};

%summarise and export the data to database
nums = [];
for i=1:num_subgraphs
    subgraph_id = i;
    num_nodes  = 0;
    nodes = '';
    for j=1:length(subgraphs)
        if (subgraphs(j)==subgraph_id) % count number of nodes in a subgraph i
            num_nodes=num_nodes+1;
            nodes =  strcat(nodes,(strcat(':', num2str(j))));%also, add node ids in one subgraph into nodes text
        end
    end
    %remove the first semicoloms in the text containning all nodes
    if (isempty(nodes) == false) %if there are any shortest path values in the string, remove the first : 
        nodes(1)='';
    end
    datainsert(conn,tablename, fieldnames,{subgraph_id num_nodes nodes});
end

