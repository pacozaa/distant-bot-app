UtilAngle = {
  dist : function(angA, angB){
    return Math.abs(this.minus(angA, angB));
  },
  minus :function(angA, angB){
    let diff = angA - angB;
    if( diff > Math.PI ){
      return Math.PI - diff;
    }
    else if( diff < -Math.PI){
      return -Math.PI - diff;
    }
    return diff;
  }
}
