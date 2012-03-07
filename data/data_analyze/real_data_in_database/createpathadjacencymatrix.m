function [ undirected_path_matrix ] = createadjacencymatrix(num_nodes,relationship)
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here
undirected_influent_matrix = zeros(num_nodes); %initialize matrix to store all of the frequency between 2 nodes
for i=1:length(relationship)
    user_id1=relationship{i,1};
    user_id2=relationship{i,2};
    inf_1to2=relationship{i,3};
    inf_2to1=relationship{i,4};
    if (user_id1 > 0 && user_id2 > 0 && user_id1 <=num_nodes && user_id2<=num_nodes)  %since database rule user_id start from 1, and less than or equal the number of nodes (users)
        undirected_influent_matrix(user_id2,user_id1) = inf_1to2 + inf_2to1; %since the database rule is : user_id2>user_id1, then uses index(user_id2,user_id1) to create lower triangonal matrix        
    else
        exit;%if there is any invalid data from the database, just for testing
    end
    
end

undirected_path_matrix = zeros(num_nodes); %initialize matix to store all of distance between 2 nodes
for i=1:num_nodes
    for j=1:i-1
        if (undirected_influent_matrix(i,j) > 0) %database rule: sum_inf > 0, then the distance between 2 nodes is a reverse of sum_inf( or frequency)
            undirected_path_matrix(i,j) = 1/undirected_influent_matrix(i,j);
        end
    end
end

end

