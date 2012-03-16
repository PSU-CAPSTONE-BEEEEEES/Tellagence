function [ shortestpath_adjacency_matrix ] = createshortestpathadjacencymatrix()
%CREATESHORTESTPATHADJACENCYMATRIX Summary of this function goes here
%output : the ajacency matrix containing all of shortest path values
%   Detailed explanation goes here
[num_nodes relationship] = importdata; % call importdata function to get all of data about relationship between users, and the number of users
adjacency_matrix = createpathadjacencymatrix(num_nodes,relationship);%store all of relationship data into the adjacency matrix
[BGobj weight_vector] = prepareinputsforbiographalgorithm(adjacency_matrix); %call this function to prepare inputs for allshortestpaths algorithm in Bioinformatic toolbox
shortestpath_adjacency_matrix = allshortestpaths(BGobj,'Directed',false,'Weights',weight_vector); % perform analyzing data to get all of shortest paths between users.

end

