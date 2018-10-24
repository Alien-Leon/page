var svg = d3.select('svg');
var l = 4,m = 4,n = 4;
var ar = [[3,3,2,4],
          [3,2,3,3],
          [2,4,3,4],
          [1,3,4,3],
          ];
var temp = [[3,3,2,4],
          [3,2,3,3],
          [2,4,3,4],
          [1,3,4,3],
          ];
var di = [0, 1, -1, 0];
var dj = [1, 0, 0, -1];
var max_swap = [0,0,0,0];   // 记录取得最大分数的交换i,j,gi,gj   
var speed = 100;
var height = 600;
var width = 600;
var size = 60;
var score = 0;
var animation = new Array();
img = ['',     
       'emoji/Speak_No_Evil_Monkey_Emoji.png',
       'emoji/Ghost_Emoji.png',
       'emoji/Slightly_Smiling_Face_Emoji.png',      
       'emoji/Alien_Emoji.png',
       'emoji/Bear_emoji_icon_png.png',
       'emoji/Thinking_Face_Emoji.png']


init();

// animation test
// swap_animation(d3.select('#ar_0_0'), d3.select('#ar_0_1'));
// distory_animation(d3.select('#ar_2_3'));
// dropdown_animation(d3.select('#ar_1_3'),1);

// solution_by_swap();
// animation = animation.reverse();
// console.log(animation);
//  startTimer();

function startTimer() {
    timer = setInterval(start_animation, speed+300);
}


function dropdown_animation(items, col_count){
    for(var i = 0; i < items.length; i++)
    {
        for(var j = 0; j < items[i].length; j++)
        {var item = d3.select('#ar_'+items[i][j][0]+'_'+items[i][j][1]);
        item.transition()
            .duration(speed)
            .attr('y', parseInt(item.attr('y'))+(col_count[i] +1)*size);
        item_id_y_update(item, col_count[i]+1);}
    }

}

// 更新下落后的对应id
function item_id_y_update(item, dropcount){
    var o = item.attr('id');
    var newrow = parseInt(o[3]) + dropcount;  // 提取对应行
    item.attr('id', 'ar_'+newrow+'_'+o[5]) ;
}

function swap_animation(itemA, itemB) {
    var item1 = d3.select('#ar_'+itemA[0]+'_'+itemA[1]);
    var item2 = d3.select('#ar_'+itemB[0]+'_'+itemB[1]);
    var x1 = item1.attr('x');
    var x2 = item2.attr('x');
    var y1 = item1.attr('y');
    var y2 = item2.attr('y');
    var id1 = item1.attr('id');
    var id2 = item2.attr('id');
    item1.transition()
        .duration(speed)
        .attr('x', x2)
        .attr('y', y2)
        .attr('id', id2);

    item2.transition()
        .duration(speed)
        .attr('x', x1)
        .attr('y', y1)
        .attr('id', id1);
}

function destory_animation(items) {
    for(var i = 0; i < items.length; i++){
        var item = d3.select('#ar_'+items[i][0]+'_'+items[i][1]);
        item.transition()
            .duration(speed)
            .styleTween("opacity", function() {
                return d3.interpolateNumber(100, 0);
            })
            .remove();
    }
        
}

function swap(x, y) {
    return [y, x];
}

// 加载图像
function init() {
    var img_html = ""
    var x = 0;
    var y = 0;
    d3.selectAll('image').remove();
    for (var i = 0; i < ar.length; i++) {
        for (var j = 0; j < ar[i].length; j++) {
            svg.append('image')
                .attr('xlink:href', img[ar[i][j]])
                .attr('width', size)
                .attr('height', size)
                .attr('x', x)
                .attr('y', y)
                .attr('id', 'ar_'+i+'_'+j);
            x += size;
        }
        y += size;
        x = 0;
    }
}

function load_image() {

}


// 播放动画
function start_animation(){
    if(animation.length > 0){
        a = animation.pop();
        switch (a.action) {
            case "swap": {
                swap_animation(a['item1'], a['item2']);
                break;
            }
            case "dropdown": {
                dropdown_animation(a['items'], a['col_count']);
                break;
            }
            case "destory": {
                destory_animation(a['items']);
                break;
            }
            case "reload": {
                init();
                break;
            }
        }
        return false;
    }
    return true;
}




/* 算法部分 */
// 判断坐标是否越界
function coordinate_validate(i, j)
{
    if(i < 0 || j < 0 || i >= m || j >= n)
        return false; 
    return true;
}

function addScore(count)
{
	if (count == 2)
	{
		score += 1;

	}
	else if (count == 3)
	{
		score += 4; 

	}
	else if (count == 4)
	{
		score += 10;

	}
}

// 消除ar[i][j]四周可消除点
function eliminate(i, j)
{
    
	// 对于空元素无需判断
	if (ar[i][j] == 0)
        return false;
        
    var count = [0, 0, 0, 0]; // 对应每个方向可被消除的个数
    var canEliminate = false;
    for(var k = 0; k < 4; k++)
    {
        var ni = i + di[k];
        var nj = j + dj[k];
        while(coordinate_validate(ni, nj) && ar[i][j] == ar[ni][nj] )
        {
            count[k]++;
            console.log('ni-nj '+ni+','+nj);
            ni = ni + di[k];
            nj = nj + dj[k];
        }

    }
    console.log(count);
    var eliminate_items = new Array();

	// 横向可消除
	var countj = count[0] + count[3];
	if(countj >= 2)
	{
		canEliminate = true;
		addScore(countj);
		// 从右边消除至左边
		for(var cj = j + count[0]; cj >= j - count[3]; cj--){
            ar[i][cj] = 0;
            eliminate_items.push([i, cj]);
        }
			
	}
	// 纵向可消除
	var counti = count[1] + count[2];
	if (counti >= 2)
	{
		canEliminate = true;
		addScore(counti);
		// 从下方消除至上方
		for (var ci = i + count[1]; ci >= i - count[2]; ci--){
            ar[ci][j] = 0;
            eliminate_items.push([ci, j]);
        }		
	}
	
	if (canEliminate)
	{
        eliminate_items = Array.from(new Set(eliminate_items)); //去重
		animation.push({'action':'destory', 'items': eliminate_items});
		return true;
	}
    return false;
}

// 消除后对应空位由上方元素填充
function dropdown()
{
    // 每一列下落个数不一定一致、待完成
    var dropdown_items = new Array();
    var col_count = new Array();
    for(var k = 0; k < n; k++)  // 蛮力扫描所有列，效率待提高
    {       
        var count = 0;
        
        // 检查该列是否需要填充
        for(var curi = m-1; curi >= 0; curi--)
        {
            if(ar[curi][k] == 0)
            {
                var ci = curi - 1;
                // 计算该列被消除的个数
                while(ci >= 0 && ar[ci][k] == 0)
                {
                    count++;
					ci--;
                }
                ci = curi - count - 1;
                var col_items = new Array();    // 受下落影响的元素
                // 元素下落
                while(ci >= 0)
                {
                    
                    col_items.push([ci, k]);
                    
                    ar[curi--][k] = ar[ci][k];
                    ar[ci--][k] = 0;
                    
                }
                if(col_items.length > 0) {
                    dropdown_items.push(col_items);
                    col_count.push(count);
                }
                

                break;
            }
            
        }
    }

    animation.push({'action':'dropdown','items':dropdown_items, 'col_count':col_count});

	/*cout << "After dropdown" << endl;
	print_array();*/


	// 需要检查下落后是否还有可消除元素
	// 对受下落影响的元素进行扫描
	// 蛮力扫描，待优化
	for (var ii = 0; ii < m; ii++)
		for (var jj = 0; jj < n; jj++)
            eliminate(ii, jj)   //bug!!  消除两个4块的后出现bug
            // bug
			// if(eliminate(ii, jj))
            //     dropdown();

}

function eliminate_merge(dir, i, j, gi, gj)
{
    var eliminate1 = eliminate(i, j);
    var eliminate2 = eliminate(gi, gj)
    if(eliminate1 || eliminate2)
    {
        dropdown(i, j, gi, gj);

        return true;
    }
    return false;
}

function copy_array()
{
    for(var i = 0; i < m; i++)
        for(var j = 0; j < n; j++)
            ar[i][j] = temp[i][j];
}

function solution_by_swap()
{
    var max = -1;
	copy_array();
    for(var i = 0; i < m; i++)
        for(var j = 0; j < n; j++)
        {
            // 交换只需考虑2个方向
            for(var k = 0; k < 2; k++)
            {
                
                var gi = i + di[k];
                var gj = j + dj[k];
                // 越界判断
                if(gi >= m || gj >= n)
                    continue;

                [ar[i][j],ar[gi][gj]] = swap(ar[i][j], ar[gi][gj]);
                console.log('swap '+i+','+j+'<->'+gi+','+gj);
				animation.push({'action':'swap', 'item1':[i, j], 
                                                    'item2': [gi, gj]});
                
                // 检查该方向是否可消除
				if (eliminate_merge(k, i, j, gi, gj)) {
                    if (score > max)
					{
						max = score;
						max_swap[0] = i;
						max_swap[1] = j;
						max_swap[2] = gi;
						max_swap[3] = gj;
					}
                    score = 0;
                    
                    copy_array();
                    animation.push({'action':'reload'});
				}
				else {                   
                    [ar[i][j],ar[gi][gj]] = swap(ar[i][j], ar[gi][gj]);
                    animation.push({'action':'swap', 'item1':[i, j], 
                                                    'item2': [gi, gj]});
                }
					
                

            }
        }
    // cout << "score: " << max << endl;
	// cout << "max_swap" << endl;
	// cout << max_swap[0] << "," << max_swap[1] << "<-->" << max_swap[2] << "," << max_swap[3] << endl;
	return max;
}

/* 算法部分结束 */

var pos1i=-1, pos1j=-1;
var pos2i=-1, pos2j=-1;
images = d3.selectAll('image')
images.on("click", function() {
    var o = d3.select(this).attr('id');
    var row = parseInt(o[3]);  // 提取对应行
    var col = parseInt(o[5]);   //对应列
    if(pos1i != -1)
    {
        pos2i = row;
        pos2j = col;

        [ar[pos1i][pos1j],ar[pos2i][pos2j]] = swap(ar[pos1i][pos1j],ar[pos2i][pos2j]);
        animation.push({'action':'swap', 'item1':[pos1i, pos1j], 
                                            'item2': [pos2i, pos2j]});
        start_animation();
        eliminate_merge(0,pos1i,pos1j,pos2i,pos2j);
        animation = animation.reverse();
        // startTimer();
        // done
        pos1i = -1;
    }
    else{
        pos1i = row;
        pos1j = col;
    }
})
