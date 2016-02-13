// Copyright 2016, University of Colorado Boulder

/**
 *
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var ParametricSpringNode = require( 'SCENERY_PHET/ParametricSpringNode' );
  var Line = require( 'SCENERY/nodes/Line' );
  //var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @param {Spring} Spring model object
   * @param {Object} [options]
   * @constructor
   */
  function SpringNode( spring, mvt, options ) {

    var self = this;
    Node.call( this, options );
    this.spring = spring;
    //this.translation = mvt.modelToViewPosition( this.spring.position );
    var line = new Line( 0, 0, 0, mvt.modelToViewDeltaY( -spring.lengthProperty.get() ),
      { stroke: 'black', lineWidth: 10.5 }
    );
    this.addChild( line );
    spring.lengthProperty.link( function( length ) {
      //line.setPoint2( 0, mvt.modelToViewDeltaY( length ) );
      line.setLine(   0, 0, 0, mvt.modelToViewDeltaY( -length )  );
    } );
    spring.positionProperty.link( function( position ) {
      self.translation = mvt.modelToViewPosition( position );
    } );
    //// ParametricSpringNodeOptions
    //options = _.extend( {
    //  loops: 10, // {number} number of loops in the coil
    //  pointsPerLoop: 40, // {number} number of points per loop
    //  radius: 10, // {number} radius of a loop with aspect ratio of 1:1
    //  aspectRatio: 4, // {number} y:x aspect ratio of the loop radius
    //  unitDisplacementLength: 1, // {number} view length of 1 meter of displacement
    //  minLineWidth: 3, // {number} lineWidth used to stroke the spring for minimum spring constant
    //  deltaLineWidth: 0.005, // increase in line width per 1 unit of spring constant increase
    //  leftEndLength: 15, // {number} length of the horizontal line added to the left end of the coil
    //  rightEndLength: 25, // {number} length of the horizontal line added to the right end of the coil
    //  //pathBoundsMethod: 'none', // {string} method used to compute bounds for scenery.Path components, see Path.boundsMethod
    //  rotation: -3 * Math.PI / 2  // {number} angle in radians of rotation of spring
    //}, options );
    //ParametricSpringNode.call( this, options );

    // stretch or compress the spring
    //spring.lengthProperty.link( function( length ) {
    //  //// ParametricSpringNode calculations
    //  //var coilLength = ( length * options.unitDisplacementLength  ) - ( options.leftEndLength + options.rightEndLength );
    //  //var xScale = coilLength / ( self.model.loopsProperty.get() * self.model.radiusProperty.get() );
    //  //// Investigating additional processing from mvt
    //  //self.model.xScaleProperty.set( mvt.modelToViewDeltaY( xScale ) / 210 );
    //  //console.log( 'xScale ', self.model.xScaleProperty );
    //}


    //// ParametricSpringNode width update
    //// springConstant determines lineWidth
    //spring.springConstantProperty.link( function( springConstant ) {
    //  var lineWidth = options.minLineWidth + options.deltaLineWidth * ( springConstant - spring.springConstantRange.min );
    //  self.model.lineWidthProperty.set( lineWidth );
    //} );

  }

  massesAndSprings.register( 'SpringNode', SpringNode );

  return inherit( Node, SpringNode );

} );
