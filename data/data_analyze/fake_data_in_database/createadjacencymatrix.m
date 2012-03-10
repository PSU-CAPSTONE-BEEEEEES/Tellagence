function [ undirected_path_matrix ] = createadjacencymatrix(num_nodes,data )
%UNTITLED2 Summary of this function goes here
%input : number of nodes(user ids), and the data containing all
%relationship between users.
%output : undirected adjacency matrix containing all of the path between
%users (path = 1/sum_of_influence, sum_of_infuence = the sum of frequencies of talking between 2 users)
%   Detailed explanation goes here

%intialize the adjacency matrix for storing all of the relationship data in
%to it
undirected_influent_matrix = zeros(num_nodes);
for i=1:length(data)
    user_id1=data{i,1};
    user_id2=data{i,2};
    inf_1to2=data{i,3};
    inf_2to1=data{i,4};
    if (user_id1 > 0 && user_id2 > 0 )         
        undirected_influent_matrix(user_id1,user_id2) = inf_1to2 + inf_2to1; %reverse if user_id2>user_id1, to create lower triangonal matrix        
    end
end

%create undirected path adjacency matrix from undirected influent matrix.
undirected_path_matrix = zeros(num_nodes);
for i=1:num_nodes
    for j=1:i-1
        if (undirected_influent_matrix(i,j) > 0)
            undirected_path_matrix(i,j) = 1/undirected_influent_matrix(i,j);
        end
    end
end

end

