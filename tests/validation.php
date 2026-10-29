<?php
require dirname(__DIR__) . '/backend/bootstrap.php';
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); }
$valid = ['name'=>"Test O'Connor",'email'=>'test@example.com','phone'=>'+971 50 123 4567','service'=>'Veneers','doctor'=>'Dr. Manal Dandan','date'=>(new DateTimeImmutable('tomorrow',new DateTimeZone('Asia/Dubai')))->format('Y-m-d'),'time'=>'11:30','notes'=>'Test request','request_id'=>'b3eed1ef-3650-4bf5-bddf-b2f4bc5a7d21'];
check(validate_booking($valid)[1] === [], 'Valid request rejected');
foreach (['date'=>'2026-02-30','doctor'=>'Unknown','service'=>'Unknown','email'=>'bad','phone'=>'123','time'=>'23:00','notes'=>'','name'=>['bad'],'request_id'=>'bad'] as $key=>$bad) {
    $input=$valid; $input[$key]=$bad; check(isset(validate_booking($input)[1][$key]), 'Invalid '.$key.' accepted');
}
$input=$valid;$input['time']='';check(validate_booking($input)[1] === [], 'Optional time rejected');
$input=$valid;$input['notes']=str_repeat('x',2001);check(isset(validate_booking($input)[1]['notes']), 'Oversized notes accepted');
echo "Validation checks passed.\n";
