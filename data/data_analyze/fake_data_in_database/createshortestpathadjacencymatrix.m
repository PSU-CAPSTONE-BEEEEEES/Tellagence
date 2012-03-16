function [ shortestpath_adjacency_matrix ] = createshortestpathadjacencymatrix()
%CREATESHORTESTPATHADJACENCYMATRIX Summary of this function goes here
% output : adjacency matrix containing all of shortest path values between
% every user ids
%   Detailed explanation goes here
data = importdata; % call importdata function to get all of data about relationship between users
adjacency_matrix = createadjacencymatrix(1000,data);% store all of relationship data into the adjacency matrix(1000 users in 'fake' data)
[BGobj weight_vector] = prepareinputsforbiographalgorithm(adjacency_matrix); %call this function to prepare inputs for allshortestpaths algorithm in Bioinformatic toolbox
shortestpath_adjacency_matrix = allshortestpaths(BGobj,'Directed',false,'Weights',weight_vector); % perform analyzing data to get all of shortest paths between users.
end

