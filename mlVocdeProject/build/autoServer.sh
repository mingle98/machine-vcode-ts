#! /bin/bash
tarsPath=$1
projectName=$2
serverPublic=/root/server/public/

# 部署项目
echo -e "hello today is $(date), satrt to deploy project..."
if test -z $tarsPath
then
    # 请输入压缩包地址,例如tars
    echo "Please enter the address of the compressed package, such as TARS"
    read -p "address of the compressed package(/root/tars/):" enterPath
    tarpath=$enterPath
fi

cd $tarpath
test -z $projectName && {
    read -p "Please enter projectNam:" _projectName
    test -n $_projectName && projectName="$_projectName.tar"
    test -z $_projectName && projectName='output.tar'
}
echo "projectName is $projectName, serverPublic is $serverPublic, tarpath is $tarpath>>>>>>"

tar -xvf $projectName
if [ $? == 0 ]
then
    test -n "$serverPublic${projectName//.tar//}" && rm -rf "$serverPublic${projectName//.tar//}"
    mv ${projectName//.tar//} $serverPublic
    echo "deploy project success and will cd $serverPublic to look detail.."
    sleep 3
    cd $serverPublic
    echo `ls`
    # 请确认本项目是否部署成功
    echo "Please confirm whether the project is successfully deployed"
    read -p "successfully deployed enter 1 or 0:" successfully
    test $successfully -eq 1 && {
        echo "will to delete the $tarsPath$projectName"
        cd $tarpath
        rm -r $projectName ${projectName//.tar//}
        test $? -eq 0 && echo "delete success"
    }
fi