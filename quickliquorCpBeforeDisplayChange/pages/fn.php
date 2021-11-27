<?php
$idx = $_POST['idx'] ?? '';
$purpose = $_POST['purpose'] ?? '';
$namecount = $_POST['namecount'] ?? '';
$changeArr = $_POST['changeArr'] ?? '';
$originalname = $_POST['originalname'] ?? '';
$item_name = $_POST['item_name'] ?? '';
////////////
class Booz {
	protected function do_config($num) {
		$config=file_get_contents('config');
		$config_values = [];
		$arr = explode(',', $config);
		$val_arr = ['/^h:/', '/^d:/', '/^u:/', '/^p:/'];
		$dsn_parts = [];
		foreach($arr as $current) {
			for($i = 0;$i < count($val_arr); $i++) {
				if(preg_match($val_arr[$i], $current) === 1) {
					$arr_letter = $current[0];
					$arr_name = $arr_letter . 'Arr';
					$$arr_name = preg_split('/:/', $current);
					$$arr_letter = $$arr_name[1];
					array_push($dsn_parts, $$arr_letter);
				}
			}
		}
		return $dsn_parts[$num];
	}	
	public function __construct() {
		//the :: operator allows you to access per class constants
		//the special keywords self, static, and parent are used to access properties or methods from inside the class definition.
		$host = $this->do_config(0);
		$db = $this->do_config(1);
		$user = $this->do_config(2);
		$pass = $this->do_config(3);			
		
		$conStr = sprintf("mysql:host=%s;dbname=%s",$host, $db);
		//echo $conStr;
		try {
			$this->pdo = new PDO($conStr, $user, $pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
	}
	private $pdo = null;
	public function do_booz_by_type($idx) {
		try {
			$this->pdo->beginTransaction();
			$sql = "SELECT i_name, i_dist FROM items WHERE i_type = $idx";

			$stmt = $this->pdo->prepare($sql);
			$stmt->execute();
			echo "<ul class = 'itemList'>";
			while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
				$sql_name = $result->i_name;
				$sql_dist = $result->i_dist;
				echo "<li dVal = $sql_dist>$sql_name</li>";
				echo "<input type = 'text' id = '$sql_name'></input>";
			}
			echo "</ul>";
			$stmt->closeCursor();
			$this->pdo->commit();
			return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
	public function process_count($namecount) {
		$namecount_str = $namecount;
		$item_names = [];
		$item_counts = [];
		$sql_arr = [];
		$namecount_vals = explode(',', $namecount_str);
		foreach($namecount_vals as $current) {
			$item_name_count_arr = (preg_split("/[-][-]/", $current));
			array_push($item_names, $item_name_count_arr[0]);
			array_push($item_counts, $item_name_count_arr[1]);
		}
		for($i = 0; $i < count($namecount_vals); $i++) {
			$sql = "UPDATE items SET on_hand = $item_counts[$i] WHERE i_name = '$item_names[$i]'";
			array_push($sql_arr, $sql);
		}
		try {
			$this->pdo->beginTransaction();
			foreach($sql_arr as $current) {
				$sql = $current;
				$stmt = $this->pdo->prepare($sql);
				$stmt->execute();
				$stmt->closeCursor();
			}
			$this->pdo->commit();
			return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
	public function get_order_by_dist($idx) {
		try {
			//echo "<h1>Purpose: $purpose</h1>";
			$idx = $idx - 1;
			$sql_order_views = ["SELECT * from so_order", "SELECT * from co_order", "SELECT * from cr_order", "SELECT * from yo_order"];
			$this->pdo->beginTransaction();
			$stmt = $this->pdo->prepare($sql_order_views[$idx]);
			$stmt->execute();
			$count = 1;
			echo "<table id = 'orderTable'><thead><th>Item</th><th>Order</th><th>Unit</th><th>Unit Type</th><th>On Hand</th></thead>";
			while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
				$sql_name = $result->name;
				$sql_default = $result->default;
				$sql_unit = $result->unit;
				$sql_unit_type = $result->unit_type;
				$sql_current = $result->current;
				echo "<tr><td>$sql_name</td><td>$sql_default</td><td>$sql_unit</td><td>$sql_unit_type</td><td>$sql_current</td></tr>";
				$count += 1;
			}
			echo "<p id = 'count'>$count</p>";
			echo "</tbody></table>";
			$stmt->closeCursor();
			$this->pdo->commit();
			return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
	public function displayTableForEdit($idx) {
		try {
			$idx = $idx - 1;
			$sql_manageable_tables = ["SELECT * from i_Details", "SELECT * from dists", "SELECT * from order_units", "SELECT * from ordered", "SELECT * from unit_quantity"];
			//$this->pdo->beginTransaction();
			$stmt = $this->pdo->prepare($sql_manageable_tables[$idx]);
			$stmt->execute();
			echo "<table id = 'resultTable'>
					<caption>Results Table</caption>
					<thead class = 'resultHead'>";
			switch($idx) {
				//items
				case 0 :
						echo "
						<th class = 'col1'>Item</th>
						<th>Dist</th>
						<th>Type</th>
						<th>Par</th>
						<th>Unit</th>
						<th>Units</th>
						<th>Quantity</th>
						<th>On Hand</th>
					</thead>";
			
					while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
						$sql_i_name = $result->Name;
						$sql_i_dist = $result->Dist;
						$sql_i_type = $result->Type;
						$sql_i_par = $result->Par;
						$sql_d_order_type = $result->Unit;
						$sql_d_order_quantity = $result->Units;
						$sql_default_order = $result->Quantity;
						$sql_on_hand = $result->On_Hand;
						echo "
							<tr id = '" . $sql_i_name . "' class = 'itemRow'>
								<td class = 'col1'>$sql_i_name</td>
								<td>$sql_i_dist</td>
								<td>$sql_i_type</td>
								<td>$sql_i_par</td>
								<td>$sql_d_order_type</td>
								<td>$sql_d_order_quantity</td>
								<td>$sql_default_order</td>
								<td>$sql_on_hand</td>
							</tr>";
					}
				break;
				//dists
				case 1 :
						echo "
							<th class = 'col1'>d_id</th>
							<th>d_name</th>
						</thead>";
						
					while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
						$sql_d_id = $result->d_id;
						$sql_d_name = $result->d_name;
						echo "
							<tr class = 'itemRow'>
								<td class = 'col1'>$sql_d_name</td>
								<td>$sql_d_id</td>
							</tr>";
					}
				break;
				//order_units
				case 2 :
						echo "
							<th>ou_name</th>
							<th class = 'col1'>ou_id</th>
						</thead>";
						
					while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
						$sql_ou_id = $result->ou_id;
						$sql_ou_name = $result->ou_name;
						echo "
							<tr class = 'itemRow'>
								<td class = 'col1'>$sql_ou_name</td>
								<td>$sql_ou_id</td>
							</tr>";
					}
				break;
				//ordered
				case 3 :
						echo "
							<th>o_name</th>
							<th class = 'col1'>o_id</th>
							<th>o_quantity</th>
							<th>o_unit</th>
							<th>o_unit_quantity</th>
							<th>o_date</th>
						</thead>";
						
					while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
						$sql_o_id = $result->o_id;
						$sql_o_name = $result->o_name;
						$sql_o_quantity = $result->o_quantity;
						$sql_o_unit = $result->o_unit;
						$sql_o_unit_quantity = $result->o_unit_quantity;
						$sql_o_date = $result->o_date;
						echo "
							<tr class = 'itemRow'>
								<td class = 'col1'>$sql_o_name</td>
								<td>$sql_o_id</td>
								<td>$sql_o_quantity</td>
								<td>$sql_o_unit</td>
								<td>$sql_o_unit_quantity</td>
								<td>$sql_o_date</td>
							</tr>";
					}
				break;
				//unit_quantity
				case 4 :
						echo "
							<th>uq_name</th>
							<th class = 'col1'>uq_id</th>
						</thead>";
						
					while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
						$sql_uq_id = $result->uq_id;
						$sql_uq_name = $result->uq_name;
						echo "
							<tr class = 'itemRow'>
								<td class = 'col1'>$sql_uq_name</td>
								<td>$sql_uq_id</td>
							</tr>";
					}
				break;
				default :
					echo "<h2>Error getting table results</h2>";
				break;
			};
			echo "
				</tbody>
				<tfoot>
					<tr>
						<td></td>
					</tr>
				</tfoot>
				</table>";
			//$stmt->closeCursor();
			//$this->pdo->commit();
			//return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
	public function updateItem($idx, $originalname, $changeArr) {
		$tbls = ["items", "dists", "order_units", "ordered", "unit_quantity"];
		$index = $idx - 1;
		$table = $tbls[$index];
		$sql_change_num = 1;
		$queries = [];
		foreach($changeArr as $current) {
			$query_name = "\nsql_change_query" . $sql_change_num;
			$change_field = str_replace(':', '=', $current);
			$query = "UPDATE $table SET $change_field WHERE i_name = '$originalname';";
			array_push($queries, $query);
			$sql_change_num += 1;
		}
		$query_count = count($queries);
		$stop_cursor = $query_count - 1;
		try {
			$this->pdo->beginTransaction();
			for($i = 0;$i < $query_count; $i++) {
				echo $queries[$i];
				$stmt = $this->pdo->prepare($queries[$i]);
				$stmt->execute();
				if($i !== $stop_cursor) {
					$stmt->closeCursor();
				}
			}
			$this->pdo->commit();
			return true;
		} catch(PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
			echo $e->getMessage();
		}
	}
	public function do_info($idx) {
		try {
			$this->pdo->beginTransaction();
			$sql = "SELECT i_name FROM items WHERE i_type = $idx";

			$stmt = $this->pdo->prepare($sql);
			$stmt->execute();
			echo "<ul class = 'itemList'>";
			while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
				$sql_name = $result->i_name;
				echo "<li onclick = 'doItemInfo(this)'>$sql_name</li>";
			}
			echo "</ul>";
			$stmt->closeCursor();
			$this->pdo->commit();
			return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
	public function do_item_info($item_name) {
		//echo "Item Name: $item_name";
		try {
			$this->pdo->beginTransaction();
			$sql = "call itemOrderedInfo('$item_name');";
			echo $sql;
			$stmt = $this->pdo->prepare($sql);
			//$stmt->bindParam(':item_name', $item_name, PDO::PARAM_STR);
			$stmt->execute();
			while($result = $stmt->fetch(PDO::FETCH_OBJ)) {
				$sql_field_name = $result->Item_Name;
				$sql_field_bottle_quantity = $result->Bottle_Quantity;
				$sql_field_case_quantity = $result->Case_Quantity;
				$sql_field_total_quantity = $result->Total;
				$sql_field_datestart = $result->Date_Start;
				$sql_field_dateend = $result->Date_End;
				$sql_field_days_first_order = $result->Days_Since_First_Order;
				$sql_field_per_day = $result->Per_Day_Rate;
				$sql_field_per_unit = $result->Per_Unit_Rate;
				$sql_field_par = $result->Item_Par;
				$sql_field_type = $result->Item_Type;
				$sql_field_on_hand = $result->On_Hand;
				echo "
				<div class = 'orderHistorySqlView'>
					<p id = 'selectedItem'>$sql_field_name</p>
					<p id = 'bottleQuantity'>$sql_field_bottle_quantity</p>
					<p id = 'caseQuantity'>$sql_field_case_quantity</p>
					<p id = 'totalQuantity'>$sql_field_total_quantity</p>
					<p id = 'dateStart'>$sql_field_datestart</p>
					<p id = 'dateEnd'>$sql_field_dateend</p>
					<p id = 'dateFirst'>$sql_field_days_first_order</p>
					<p id = 'perDay'>$sql_field_per_day</p>
					<p id = 'perUnit'>$sql_field_per_unit</p>
					<p id = 'itemPar'>$sql_field_par</p>
					<p id = 'itemType'>$sql_field_type</p>
					<p id = 'itemOnHand'>$sql_field_on_hand</p>
				</div>";
			}
			$stmt->closeCursor();
			$this->pdo->commit();
			return true;
		} catch (PDOException $e) {
			$this->pdo->rollback();
			die($e->getMessage());
		}
	}
}



$new_query = new Booz();
if($purpose == 1) {
	$new_query->do_booz_by_type($idx);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 2) {
	$new_query->process_count($namecount);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 3) {
	$new_query->get_order_by_dist($idx);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 4) {
	$new_query->displayTableForEdit($idx);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 5) {
	$new_query->updateItem($idx, $originalname, $changeArr);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 6) {
	$new_query->do_info($idx, $purpose);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
if($purpose == 7) {
	$new_query->do_item_info($item_name);
	echo "<div id = 'tmpDiv'><p> $purpose </p></div>";
}
?>