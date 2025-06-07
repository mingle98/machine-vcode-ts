#! /bin/bash

# 接收参数
tarpath=$1;
tarName=$2;
serverHost=root@120.48.148.17
serverHostTarsPath=root@120.48.148.17:/root/tars/

deleteTar() {
	test -e $tarName && {
		rm -rf $tarName
		test $? -eq 0 && echo "delete $tarName success"
	}
}
# 将压缩包传输到远程服务器
function step3Fn() {
	printf "the setp3 start...."
	scp $tarName $serverHostTarsPath
	test $? -eq 0 && { 
		echo "$serverHost had get $tarName\n, then please to mv to server Dirname>>>>>"
		ssh $serverHost
	}
	return 0
}


if [ -z $tarpath ] || [ -z $@ ]
then
	echo 'the tarpath is empty...'
	exit 1
fi
! test -e $tarpath && { 
	echo "the tarpath is wrong..."
	exit 2
}
test -z $tarName && {
	read -p "please enter tarName:" _tarName
	test -n $_tarName && tarName="$_tarName.tar"
	test -z $_tarName && tarName='output.tar'
}
echo "waiting..."

printf "the step1 start.....\n"
sleep 3
test -e  $tarpath && tar -cvf $tarName $tarpath
if [ $? == 0 ] && test -e $tarName 
then 
	echo "the $tarName build success..."
else 
 	echo "the $tarName build fail.."
	deleteTar
	exit 3
fi

printf "the step2 start..."
if [ $? -eq 0 ] 
then 
	echo "$serverHost connect success"
	step3Fn
else
	echo "$serverHost connect fail"
	deleteTar
	exit 4
fi

# insertPwd() {
# 	set timeout 30
# 	spawn ssh -l 用户名 10.125.25.189
# 	expect "password:"
# 	send "要输入的密码"   
# 	interact
# }

# spawn scp output.tar root@120.48.148.17v
	# expect "password:"
	# send "Zml61398"   
	# interact

	# spawn scp $local_file $remote_path 
	# expect { 
	# 	"*assword:*" { 
	# 		if { $passwderror == 1 } { 
	# 		puts "passwd is error" 
	# 		exit 2 
	# 		} 
	# 		set timeout 1000 
	# 		set passwderror 1 
	# 		send "$passwd\r" 
	# 		exp_continue 
	# 	}
	# 	"*es/no)?*" { 
	# 		send "yes\r" 
	# 		exp_continue 
	# 	} 
	# 	timeout { 
	# 		puts "connect is timeout" 
	# 		exit 3 
	# 	}
	# }