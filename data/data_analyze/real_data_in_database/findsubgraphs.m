function [num_subgraphs subgraphs ] = findsubgraphs(num_nodes, relationships)
%FINDSUBGRAPHS Summary of this function goes here
%input: number of nodes(users), and all of relationship between users
%output: subgraphs is a vector in which the index is user_id, the value is group_id
%; num_subgraphs is the number of subgraphs in the graph
%   Detailed explanation goes here

%initialize matrix to store all of the frequency between 2 nodes
influent_matrix = zeros(num_nodes);
for i=1:length(relationships)
    user_id1=relationships{i,1};
    user_id2=relationships{i,2};
    inf_1to2=relationships{i,3};
    inf_2to1=relationships{i,4};
    if (user_id1 > 0 && user_id2 > 0 && user_id1 <=num_nodes && user_id2<=num_nodes)  %since database rule user_id start from 1, and less than or equal the number of nodes (users)
        influent_matrix(user_id2,user_id1) = inf_2to1;
        influent_matrix(user_id1,user_id2) = inf_1to2;
    else
        exit;%if there is any invalid data from the database, just for testing
    end 
end


%create spare influent matrix from influent_matrix
spare_influent_matrix = sparse(influent_matrix);
[num_subgraphs,subgraphs] = graphconncomp(spare_influent_matrix,'Weak',true);

end
