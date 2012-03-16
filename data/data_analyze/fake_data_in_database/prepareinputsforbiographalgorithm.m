function [ BGobj, weight_vector ] = prepareinputsforbiographalgorithm( adjacency_matrix )
%PREPAREINPUTSFORBIOGRAPHALGORITHM Summary of this function goes here
% input : adjacency matrix 
% output : BGobj, and weight vectors which are inputs needed for
% allshortestpaths algorithm in Bioinformatic toolbox to run.
%   Detailed explanation goes here

    [w h] = size(adjacency_matrix);
    %create connection matrix, used by biograph function
    for i = 1:w
        for j = 1:h
            if (adjacency_matrix(i,j) > 0)
                c_matrix (i,j) = 1;
            else
                c_matrix (i,j) = 0;
            end
        end
    end

    %create column vector used by allshortestpaths function
    k =1;
    for i = 1:w
        for j = 1:h
            if (adjacency_matrix(j,i) > 0)
                weight_vector(k,1) = adjacency_matrix(j,i);
                k = k +1;
            end
        end
    end
    
    %create BGobj used by shortest paths algorithms provided by biograph
    BGobj = biograph(c_matrix);    

end

