clear all;
%this script is for testing the correctness of using allshortestpaths
%algorithm.
%the test contains 2 test cases
%the expected output of each test cases are produced by performing dijkstra
%algorithm.

%build test cases
adjacency_matrix1 = [0 1 1 ;1 0 1;4 1 0];
adjacency_matrix2 = [0 0 0 0 0 0; 7 0 0 0 0 0; 9 10 0 0 0 0; 0 15 11 0 0 0; 0 0 0 6 0 0 ; 14 0 2 0 9 0];
inputs = {adjacency_matrix1 adjacency_matrix2};

%build expected output
expected_shortestpath_ajacency_matrix1 = [0 1 2 ;1 0 1;2 1 0];
expected_shortestpath_ajacency_matrix2 = [0 7 9 20 20 11; 7 0 10 15 21 12; 9 10 0 11 11 2; 20 15 11 0 6 13; 20 21 11 6 0 9; 11 12 2 13 9 0];
expected_outputs = {expected_shortestpath_ajacency_matrix1 expected_shortestpath_ajacency_matrix2};

%count and calculate the percentage of correctness
correct_count = 0;
for i=1:length(inputs)
    [BGobj weight_vector] = prepareinputsforbiographalgorithm(expected_outputs{i});
    shortestpath_adjacency_matrix = allshortestpaths(BGobj,'Directed',false,'Weights',weight_vector);
    if (sum(sum(shortestpath_adjacency_matrix - expected_outputs{i}))==0)
        correct_count=correct_count+1;
    end
end

fprintf('corrected percentage : %f \n',correct_count/length(inputs)*100)


