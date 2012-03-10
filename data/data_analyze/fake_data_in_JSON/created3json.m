function [json] = created3json (adjacency_matrix, shortestpath_adjacency_matrix)
%createJSON accept adjacency matrix as input, and return json string
%accepted by d3

    [w h] = size(adjacency_matrix); %w:width h:height of the adjacency matrix
    nodes=[]; %init array of nodes -> json
    links=[]; %init array of links -> json

    %create structure needed savejson function 
    for i=1:w
       for j=1:i
           if shortestpath_adjacency_matrix(i,j)~= Inf && shortestpath_adjacency_matrix(i,j) > 0 %don't need to put links have length =0 to json
               link = struct('source',i-1,'target',j-1,'value',adjacency_matrix(i,j),'shortestpath',shortestpath_adjacency_matrix(i,j));
               links = [links link];
           end
       end
       node = struct('name',num2str(i-1));
       nodes = [nodes node];
    end

    %savejson returns json string
    json = savejson('g',struct('nodes',nodes,'links',links));

    %remove parts in json string which can not accepted by d3

    json(1)='';
    json(length(json)-1) = '';
    for i=1:4
        json(3)='';
    end

    i=1;
    while i<length(json)
        if json(i) == '[' || json(i) == ']'
            if length(str2num(json(i+1)))> 0 || length(str2num(json(i-1))) >0
                json(i)= '';
            end
        end
        i = i+1;
    end

end