var rp = require('request-promise');
var port = process.argv[2];
var express = require('express')
var app = express()

app.use(express.json());
app.use(express.urlencoded({extended:false}))



app.get('/block',function (req,res){
    res.send(bitcoin)
})

app.post('/transation',function(req, res){
    
    const blockIndex=bitcoin.creatNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
    res.json({note :'트랜젝션은 ${blockIndex}  블락안으로 들어갈 예정입니다.'})
})

app.get('/mine',function(req, res){

    const lastBlock = bitcoin.getLastBlock();

    const previousBlockHash = lastBlock['hash'];
    
    const currentBlockData = {
        transations:bitcoin.pendingTransaction,
        index:lastBlock['index'] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);

    const blockHash = bitcoin.hashBlcok(previousBlockHash,currentBlockData,nonce);

    const newBlock = bitcoin.creatNNewBlock(nonce,previousBlockHash,blockHash);

    res.json({
        note:"새로운 블락이 성공적으로 만들어졌습니다.",
        newBlock:newBlock
    })
})

app.listen(port,function(){
    console.log('listening on port ${port} ....')
})

app.post('register-and-broadcast-node',function(req,res){

    const newNodeUrl = req.body.newNodeUrl;

    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1){
        bitcoin.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];

    bitcoin.networkNodes.forEach (networkNodes => {
        
        const requestOption = {
            uri: networkNodesUrl+'/register-node',
            method: 'POST',
            body:{newNodeUrl:newNodeUrl},
            json:true
        };
        regNodesPromises.push(rp(requestOption))
    });
    
    Promise.all(regNodesPromises)
    .then(data =>{
        const bulkRegisterOption = {
            uri : newNodeUrl + '/register-nodes-bulk',
            method : 'POST',
            body : {allNetworkNodes : [...bitcoin.networkNodes,bitcoin.currentNodeUrl]},
            json : true
        };
        return rq(bulkRegisterOption);

    
    }).then(data =>{
    res.json({note:"새로운 노드가 전체 네트워크에 성공적으로 등록이 되었습니다"});

});
});
app.post('/register-node',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;

    const nodeNotAlreadyPreasent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;

    const notCurrentNode = bitcoin.currentNodeUrl !==newNodeUrl;

    if(nodeNotAlreadyPreasent&&notCurrentNode){
        bitcoin.networkNodes.push(newNodeUrl);
        res.json({note:"새로운 노드가 등록되었습니다"})
    }
})

app.post('/register-nodes-bulk',function(req,res){

})

var uuid = require('uuid/v1');

var nodeAddress = uuid().split('-').join('');


