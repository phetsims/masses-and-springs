// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var ParametricSpringNode = require( 'SCENERY_PHET/ParametricSpringNode' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Spring} Spring model object
   * @param {ModelViewTransform2} mvt
   * @param {Object} [options]
   * @constructor
   */
  function OscillatingSpringNode( spring, mvt, options ) {

    var self = this;

    options = _.extend( {
      //phase: 0,
      deltaPhase: 3 * Math.PI / 2,
      loops: 12, // {number} number of loops in the coil
      pointsPerLoop: 40, // {number} number of points per loop
      radius: 6.5, // {number} radius of a loop with aspect ratio of 1:1
      aspectRatio: 4, // {number} y:x aspect ratio of the loop radius
      unitDisplacementLength: mvt.viewToModelDeltaY( 1 ), // {number} view length of 1 meter of displacement
      minLineWidth: 1, // {number} lineWidth used to stroke the spring for minimum spring constant
      deltaLineWidth: 1.5, // increase in line width per 1 unit of spring constant increase
      leftEndLength: -15, // {number} length of the horizontal line added to the left end of the coil
      rightEndLength: -15, // {number} length of the horizontal line added to the right end of the coil
      rotation: -3 * Math.PI / 2  // {number} angle in radians of rotation of spring
    }, options );


    ParametricSpringNode.call( this, options );
    this.spring = spring;
    this.translation =  mvt.modelToViewPosition(  new Vector2 ( spring.position.x, spring.position.y - length ) );
    this.mvt = mvt;

    spring.lengthProperty.link( function ( length ) {
      // ParametricSpringNode calculations
      var coilLength = ( mvt.modelToViewDeltaY( length ) - ( options.leftEndLength + options.rightEndLength ) );
      var xScale = coilLength / ( self.model.loopsProperty.get() * self.model.radiusProperty.get() );

      //The wrong side of the PSN is static, so we have to put the spring in reverse and update the length AND position.
      //TODO There is possibly a better solution by setting the phase and deltaPhase.
      self.model.xScaleProperty.set( xScale );
      self.translation =  mvt.modelToViewPosition( new Vector2( spring.position.x, spring.position.y - length ) );
    } );

     //ParametricSpringNode width update
     //springConstant determines lineWidth
    spring.springConstantProperty.link( function( springConstant ) {
      var lineWidth = options.minLineWidth + options.deltaLineWidth * ( springConstant - spring.springConstantRange.min );
      self.model.lineWidthProperty.set( lineWidth );
    } );
  }

  massesAndSprings.register( 'OscillatingSpringNode', OscillatingSpringNode );

  return inherit( ParametricSpringNode, OscillatingSpringNode, {
    reset: function() {
      this.model.reset();
      this.spring.reset();
    }
  } );

} );
