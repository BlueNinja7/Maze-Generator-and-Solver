"use strict";

let x_component_board = 47;
let y_component_board = 29;
let board;
let source_coordinates = [3, 3];
let destination_coordinates = [43, 25];
let reset_board = true;
let set_interval;
let cell_array;
let cell_index;
let result_array;
let result_index;
let destination_cell_found = false;
let result = false;
let in_progress = false;
let set_timeout = [];

window.onload = function()
{
	before_initializing_board();
	initialize_board();
	after_initializing_board();	
	listeners();
}

function before_initializing_board()
{
	document.querySelector("#nav_bar").style.width = "330px";
	document.querySelector("#board_section").style.width = "1110px";
	document.querySelector("#board_section").style.left = "330px";
}

function initialize_board()
{
	let table = document.createElement("table");
	table.id = "table";

	for (let yindex = 0; yindex < y_component_board; yindex++)
	{
		let tr = document.createElement("tr");
		for (let xindex = 0; xindex < x_component_board; xindex++)
		{
			let cell = document.createElement("td");
			let assign_class = "cell cell_obj";
			assign_class = assign_class + " x" + xindex + " y" + yindex;
			cell.className = assign_class;
			tr.appendChild(cell);
		}
		table.appendChild(tr);
	}

	document.querySelector("#board").appendChild(table);
	board = new Array(x_component_board).fill(0).map(() => new Array(y_component_board).fill(0));
	map_x_y_coordinates(source_coordinates[0], source_coordinates[1]).classList.add("source");
	map_x_y_coordinates(destination_coordinates[0], destination_coordinates[1]).classList.add("destination");
}

function after_initializing_board()
{
	document.querySelector("#board").style.width = "1081px";
	document.querySelector("#board").style.height = "667px";
}

function listeners()
{
	document.querySelector("#maze_creation_id").addEventListener('change', event =>
	{
		create_maze();
	});

	document.querySelector("#visualize").addEventListener('click', event =>
	{
		if (in_progress)
			document.querySelector("#maze_creation_id").value = "0";
		in_progress = false;
		solve_maze();
	});

	document.querySelector("#reset").addEventListener('click', event =>
	{
        document.querySelector("#maze_solving_id").value = "0";
		reset();
	});
}

function create_maze()
{
	let source_coordinate = source_coordinates;
	let destination_coordinate = destination_coordinates;
	reload_board();
	in_progress = true;

	map_x_y_coordinates(source_coordinates[0], source_coordinates[1]).classList.remove("source");
	map_x_y_coordinates(source_coordinate[0], source_coordinate[1]).classList.add("source");
	map_x_y_coordinates(destination_coordinates[0], destination_coordinates[1]).classList.remove("destination");
	map_x_y_coordinates(destination_coordinate[0], destination_coordinate[1]).classList.add("destination");

	reset_board = false;
	if (document.querySelector("#maze_creation_id").value == "1")
		recursive_backtracker();
	else if (document.querySelector("#maze_creation_id").value == "2")
		recursive_division();
}

function solve_maze()
{
	board_reset();
	reset_board = false;

	if ((Math.abs(source_coordinates[0] - destination_coordinates[0]) == 0 && Math.abs(source_coordinates[1] - destination_coordinates[1]) == 1) ||
		(Math.abs(source_coordinates[0] - destination_coordinates[0]) == 1 && Math.abs(source_coordinates[1] - destination_coordinates[1]) == 0))
		{
			map_x_y_coordinates(source_coordinates[0], source_coordinates[1]).classList.add("shortest_path");
			map_x_y_coordinates(destination_coordinates[0], destination_coordinates[1]).classList.add("shortest_path");
		}
	else if (document.querySelector("#maze_solving_id").value == "1")
		a_star();
	else if (document.querySelector("#maze_solving_id").value == "2")
		bidirectional_first();
}

function create_wall(x_coordinates, y_coordinates)
{
	let cell = map_x_y_coordinates(x_coordinates, y_coordinates);
	if (!cell.classList.contains("source") && !cell.classList.contains("destination"))
	{
		board[x_coordinates][y_coordinates] = -1;
		cell.classList.add("cell_wall");
	}
}

function delete_wall(x, y)
{
	board[x][y] = 0;
	map_x_y_coordinates(x, y).classList.remove("cell_wall");
}

function board_reset()
{
	if (!reset_board)
	{
		set_timeout = [];
		clearInterval(set_interval);
		for (let xindex = 0; xindex < board.length; xindex++)
			for (let yindex = 0; yindex < board[0].length; yindex++)
			{
				if (board[xindex][yindex] > -1)
				{
					delete_wall(xindex, yindex);
					map_x_y_coordinates(xindex, yindex).classList.remove("cell_move");
					map_x_y_coordinates(xindex, yindex).classList.remove("shortest_path");
				}
				else if (board[xindex][yindex] < -1)
					create_wall(xindex, yindex);
				map_x_y_coordinates(xindex, yindex).classList.remove("cell_traversed");
			}
		reset_board = true;
	}
}

function fill()
{
	for (let i = 0; i < board.length; i++)
		for (let j = 0; j < board[0].length; j++)
			create_wall(i, j);
}

function get_cell(x_coordinate, y_coordinate)
{
	if (x_coordinate < board.length && x_coordinate >= 0 && y_coordinate < board[0].length && y_coordinate >= 0)
		return board[x_coordinate][y_coordinate];
	return -10;
}

function generate_random(min_value, max_value)
{
	min_value = Math.ceil(min_value);
	max_value = Math.floor(max_value);
	return Math.floor(Math.random() * (max_value - min_value)) + min_value;
}

function recursive_backtracker()
{
	let current_cell = [1, 1];
	fill();
	delete_wall(current_cell[0], current_cell[1]);
	board[current_cell[0]][current_cell[1]] = 1;
	let cell_stack = [current_cell];

	set_interval = window.setInterval(function()
	{
		if (cell_stack.length == 0)
		{
			clearInterval(set_interval);
			board_reset();
			in_progress = false;
			return;
		}
		current_cell = cell_stack.pop();
		let surrounding_cells = [];
		let list = get_surrounding_cells(current_cell, 2);

		for (let i = 0; i < list.length; i++)
			if (get_cell(list[i][0], list[i][1]) == -1 || get_cell(list[i][0], list[i][1]) == 0)
				surrounding_cells.push(list[i]);

		if (surrounding_cells.length > 0)
		{
			cell_stack.push(current_cell);
			let cell_to_be_selected = surrounding_cells[generate_random(0, surrounding_cells.length)];
			delete_wall((current_cell[0] + cell_to_be_selected[0]) / 2, (current_cell[1] + cell_to_be_selected[1]) / 2);
			delete_wall(cell_to_be_selected[0], cell_to_be_selected[1]);
			board[cell_to_be_selected[0]][cell_to_be_selected[1]] = 1;
			cell_stack.push(cell_to_be_selected);
		}
		else
		{
			delete_wall(current_cell[0], current_cell[1]);
			board[current_cell[0]][current_cell[1]] = 2;
			map_x_y_coordinates(current_cell[0], current_cell[1]).classList.add("cell_traversed");

			for (let i = 0; i < list.length; i++)
			{
				let wall = [(current_cell[0] + list[i][0]) / 2, (current_cell[1] + list[i][1]) / 2]
				if (get_cell(list[i][0], list[i][1]) == 2 && get_cell(wall[0], wall[1]) > -1)
					map_x_y_coordinates(wall[0], wall[1]).classList.add("cell_traversed");
			}
		}
	}, 16);
}

function recursive_division()
{
	create_frame();
	let duration = 0;
	let temp = 17;
	set_timeout = [];

	function inner_recursive_division(xmin, ymin, xmax, ymax)
	{
		if (ymax - ymin > xmax - xmin)
		{
			let random_x = generate_random(xmin + 1, xmax);
			let random_y = generate_random(ymin + 2, ymax - 1);

			if ((random_x - xmin) % 2 == 0)
				random_x = random_x + (generate_random(0, 2) == 0 ? 1 : -1);
			if ((random_y - ymin) % 2 == 1)
				random_y = random_y + (generate_random(0, 2) == 0 ? 1 : -1);
			for (let x_index = xmin + 1; x_index < xmax; x_index++)
				if (x_index != random_x)
				{
					duration = duration + temp;
					set_timeout.push(setTimeout(function() { create_wall(x_index, random_y); }, duration));
				}
			if (random_y - ymin > 2)
				inner_recursive_division(xmin, ymin, xmax, random_y);
			if (ymax - random_y > 2)
				inner_recursive_division(xmin, random_y, xmax, ymax);
		}
		else
		{
			let random_x = generate_random(xmin + 2, xmax - 1);
			let random_y = generate_random(ymin + 1, ymax);

			if ((random_x - xmin) % 2 == 1)
				random_x = random_x + (generate_random(0, 2) == 0 ? 1 : -1);
			if ((random_y - ymin) % 2 == 0)
				random_y = random_y + (generate_random(0, 2) == 0 ? 1 : -1);
			for (let y_index = ymin + 1; y_index < ymax; y_index++)
				if (y_index != random_y)
				{
					duration = duration + temp;
					set_timeout.push(setTimeout(function() { create_wall(random_x, y_index); }, duration));
				}
			if (random_x - xmin > 2)
				inner_recursive_division(xmin, ymin, random_x, ymax);
			if (xmax - random_x > 2)
				inner_recursive_division(random_x, ymin, xmax, ymax);
		}
	}

	inner_recursive_division(0, 0, board.length - 1, board[0].length - 1);
	set_timeout.push(setTimeout(function() { in_progress = false; set_timeout = [] }, duration));
}

function use_distance_formula(x1_y1, x2_y2)
{
	return Math.sqrt(Math.pow(x2_y2[0] - x1_y1[0], 2) + Math.pow(x2_y2[1] - x1_y1[1], 2));
}

function get_surrounding_cells(cell_coordinates, at_distance)
{
	let above_cell = [cell_coordinates[0], cell_coordinates[1] - at_distance];
	let below_cell = [cell_coordinates[0], cell_coordinates[1] + at_distance];
	let right_cell = [cell_coordinates[0] + at_distance, cell_coordinates[1]];
	let left_cell = [cell_coordinates[0] - at_distance, cell_coordinates[1]];
	return [above_cell, right_cell, below_cell, left_cell];
}

function solve_maze_animation_duration()
{
	set_interval = window.setInterval(function()
	{
		if (!result)
		{
			map_x_y_coordinates(cell_array[cell_index][0], cell_array[cell_index][1]).classList.add("cell_move");
			cell_index++;

			if (cell_index == cell_array.length)
			{
				if (!destination_cell_found)
					clearInterval(set_interval);
				else
				{
					result = true;
					map_x_y_coordinates(source_coordinates[0], source_coordinates[1]).classList.add("shortest_path");
				}
			}
		}
		else
		{
			if (result_index == result_array.length)
			{
				map_x_y_coordinates(destination_coordinates[0], destination_coordinates[1]).classList.add("shortest_path");
				clearInterval(set_interval);
				return;
			}
			map_x_y_coordinates(result_array[result_index][0], result_array[result_index][1]).classList.remove("cell_move");
			map_x_y_coordinates(result_array[result_index][0], result_array[result_index][1]).classList.add("shortest_path");
			result_index++;
		}
	}, 10);
}

function bidirectional_first()
{
	cell_array = [];
	cell_index = 0;
	result_array = [];
	result_index = 0;
	destination_cell_found = false;
	result = false;
	let current_cell;
	let source_cell;
	let destination_cell;
	let progress_array = [source_coordinates, destination_coordinates];
	board[destination_coordinates[0]][destination_coordinates[1]] = 1;
	board[source_coordinates[0]][source_coordinates[1]] = 11;

	do
	{
		current_cell = progress_array[0];
		let list = get_surrounding_cells(current_cell, 1);
		progress_array.splice(0, 1);

		for (let listIndex = 0; listIndex < list.length; listIndex++)
		{
			if (get_cell(list[listIndex][0], list[listIndex][1]) == 0)
			{
				progress_array.push(list[listIndex]);

				if (board[current_cell[0]][current_cell[1]] < 10)
					board[list[listIndex][0]][list[listIndex][1]] = listIndex + 1;
				else
					board[list[listIndex][0]][list[listIndex][1]] = 11 + listIndex;

				cell_array.push(list[listIndex]);
			}
			else if (get_cell(list[listIndex][0], list[listIndex][1]) > 0)
			{
				if (board[current_cell[0]][current_cell[1]] < 10 && get_cell(list[listIndex][0], list[listIndex][1]) > 10)
				{
					source_cell = current_cell;
					destination_cell = list[listIndex];
					destination_cell_found = true;
					break;
				}
				else if (board[current_cell[0]][current_cell[1]] > 10 && get_cell(list[listIndex][0], list[listIndex][1]) < 10)
				{
					source_cell = list[listIndex];
					destination_cell = current_cell;
					destination_cell_found = true;
					break;
				}
			}
		}
	}
	while (progress_array.length > 0 && !destination_cell_found)
	{
		if (destination_cell_found)
		{
			let destination_array = [destination_coordinates, source_coordinates];
			let source_array = [source_cell, destination_cell];

			for (let source_array_index = 0; source_array_index < source_array.length; source_array_index++)
			{
				let present_cell = source_array[source_array_index];

				while (present_cell[0] != destination_array[source_array_index][0] || present_cell[1] != destination_array[source_array_index][1])
				{
					result_array.push(present_cell);
					switch (board[present_cell[0]][present_cell[1]] - (source_array_index * 10))
					{
						case 1: present_cell = [present_cell[0], present_cell[1] + 1]; break;
						case 2: present_cell = [present_cell[0] - 1, present_cell[1]]; break;
						case 3: present_cell = [present_cell[0], present_cell[1] - 1]; break;
						case 4: present_cell = [present_cell[0] + 1, present_cell[1]]; break;
						default: break;
					}
				}
				if (source_array_index == 0)
					result_array.reverse();
			}
			result_array.reverse();
		}
	}
	solve_maze_animation_duration();
}

function a_star()
{
	cell_array = [];
	cell_index = 0;
	result_array = [];
	result_index = 0;
	destination_cell_found = false;
	result = false;
	let progress_array = [source_coordinates];
	let source_to_current = new Array(board.length).fill(0).map(() => new Array(board[0].length).fill(0));
	board[source_coordinates[0]][source_coordinates[1]] = 1;

	do
	{
		progress_array.sort(function(point_1, point_2)
		{
			let point_1_value = source_to_current[point_1[0]][point_1[1]] + use_distance_formula(point_1, destination_coordinates) * 1.414;
			let point_2_value = source_to_current[point_2[0]][point_2[1]] + use_distance_formula(point_2, destination_coordinates) * 1.414;
			return point_1_value - point_2_value;
		});
		let current_cell = progress_array[0];
		let list = get_surrounding_cells(current_cell, 1);
		progress_array.splice(0, 1);

		for (let listIndex = 0; listIndex < list.length; listIndex++)
		{
			if (get_cell(list[listIndex][0], list[listIndex][1]) == 0)
			{
				progress_array.push(list[listIndex]);
				board[list[listIndex][0]][list[listIndex][1]] = listIndex + 1;
				source_to_current[list[listIndex][0]][list[listIndex][1]] = source_to_current[current_cell[0]][current_cell[1]] + 1;
				if (list[listIndex][0] == destination_coordinates[0] && list[listIndex][1] == destination_coordinates[1])
				{
					destination_cell_found = true;
					break;
				}
				cell_array.push(list[listIndex]);
			}
		}
	}
	while (progress_array.length > 0 && !destination_cell_found)
	{
		if (destination_cell_found)
		{
			let present_cell = destination_coordinates;

			while (present_cell[0] != source_coordinates[0] || present_cell[1] != source_coordinates[1])
			{
				switch (board[present_cell[0]][present_cell[1]])
				{
					case 1: present_cell = [present_cell[0], present_cell[1] + 1]; break;
					case 2: present_cell = [present_cell[0] - 1, present_cell[1]]; break;
					case 3: present_cell = [present_cell[0], present_cell[1] - 1]; break;
					case 4: present_cell = [present_cell[0] + 1, present_cell[1]]; break;
					default: break;
				}
				result_array.push(present_cell);
			}
			result_array.pop();
			result_array.reverse();
		}
	}
	solve_maze_animation_duration();
}

function map_x_y_coordinates(x, y)
{
	return document.querySelector(".x" + x + ".y" + y);
}

function reload_board()
{
	set_timeout = [];
	clearInterval(set_interval);
	document.querySelector("#table").remove();

	before_initializing_board();
	initialize_board();
	after_initializing_board();
}

function reset()
{
	document.querySelector("#maze_creation_id").value = "0";
	reload_board();
}

function create_frame()
{
	for (let x_coordinate = 0; x_coordinate < board.length; x_coordinate++)
	{
		create_wall(x_coordinate, 0);
		create_wall(x_coordinate, board[0].length - 1);
	}
	for (let y_coordinate = 0; y_coordinate < board[0].length; y_coordinate++)
	{
		create_wall(0, y_coordinate);
		create_wall(board.length - 1, y_coordinate);
	}
}