function [ adjacency_matrix ] = createadjacencymatrix(json_filename)
%CREATEADJACENCYMATRIX Summary of this function goes here
%input : input file name containing JSON string
%output : adjacency_matrix containing information about relationship
%between pairs of users
%   Detailed explanation goes here

    data = loadjson(json_filename);
    nodes = data.nodes;
    num_nodes = length(nodes);

    adjacency_matrix = zeros(num_nodes,num_nodes); %row is source, col is target

    for i = 1:num_nodes
        node = nodes(i); %node is a struct contains 2 fields : name, influence
        source = node.name;
        %fprintf('source: %d\n',source);
        neightbors = node.influence; % neightbors is a cell contains structs
        number_neightbors = length(node.influence);
        if number_neightbors >=1
            for j = 1:number_neightbors
                neightbor = neightbors(j);% neightbor is a struct contains a cell, or a struct
                if iscell(neightbor)
                    neightbor = neightbor{1};% if neightbor is a cell then access the struct in this cell
                end
                %now, neightbor is a struct    
                field_name = fieldnames(neightbor); %field_name is a cell contains node_name and value
                node_name =  field_name{1};
                target = str2num(node_name(2));           
                value = neightbor.(node_name); 
                %fprintf('target: %d value: %d\n',target,value);
                adjacency_matrix(source,target) = value;
            end
        end
    end

end

