clear all;
%this script is for performs
%1) create adjacency matrix from the file containing JSON string
%2) prepare inputs for all shortest path algorithm provided by Bioinformatic
%toolbox
%3) perform all shortest path alogrithm
%4) create and export JSON in d3 format into the output file

input_file = strcat('./testcases/input/test','10','.json')
output_file = strcat('testcases/output/test','10','.json');

adjacency_matrix = createadjacencymatrix(input_file);
[BGobj weight_vector] = prepareinputsforbiographalgorithm(adjacency_matrix);
shortestpath_adjacency_matrix = allshortestpaths(BGobj,'Directed',false,'Weights',weight_vector);
%shortestpath(BGobj,[4,1],'Directed',true,'Weights',weight_vector)
json=created3json(adjacency_matrix,shortestpath_adjacency_matrix);

fileID = fopen(input_file,'w');
fprintf(fileID,'%s',json);
fclose(fileID);


