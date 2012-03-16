input_file = strcat('./testcases/input/test','10','.json');
data = loadjson(input_file);


links = data.links;
nodes = data.nodes;
num_links = length(links)
num_nodes = length(nodes)

adjancency_matrix = zeros(num_nodes);
for i=1:num_links
    source = links(i).source+1;
    target = links(i).target+1;
    adjancency_matrix(source,target) =  links(i).shortestpath;
end

for i=1:num_nodes
    for j=1:i-1
        if adjancency_matrix(i,j) ==0 && adjancency_matrix(j,i) ==0 
            fprintf('i = %d j = %d\n',i,j)          
        end            
    end
end


