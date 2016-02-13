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
  var ParametricSpringNode = require( 'SCENERY_PHET/ParametricSpringNode' );
  //var Line = require( 'SCENERY/nodes/Line' );

  /**
   * @param {Spring} Spring model object
   * @param {Object} [options]
   * @constructor
   */
  function SpringNode( spring, mvt, options ) {


    options = _.extend( {
      loops: 10, // {number} number of loops in the coil
      pointsPerLoop: 40, // {number} number of points per loop
      radius: 10, // {number} radius of a loop with aspect ratio of 1:1
      aspectRatio: 4, // {number} y:x aspect ratio of the loop radius
      unitDisplacementLength: 1, // {number} view length of 1 meter of displacement
      minLineWidth: 3, // {number} lineWidth used to stroke the spring for minimum spring constant
      deltaLineWidth: 0.005, // increase in line width per 1 unit of spring constant increase
      leftEndLength: 15, // {number} length of the horizontal line added to the left end of the coil
      rightEndLength: 25, // {number} length of the horizontal line added to the right end of the coil
      //pathBoundsMethod: 'none', // {string} method used to compute bounds for scenery.Path components, see Path.boundsMethod
      rotation: -3 * Math.PI / 2  // {number} angle in radians of rotation of spring
    }, options );

    var self = this;
    ParametricSpringNode.call( this, options );

    //ParametricSpringNode is horizontal, all references to x are really y.
    //this.rotation = 3 * Math.PI / 2;

    // stretch or compress the spring
    spring.lengthProperty.link( function( length ) {
      var coilLength = ( length * options.unitDisplacementLength  ) - ( options.leftEndLength + options.rightEndLength );
      var xScale = coilLength / ( self.model.loopsProperty.get() * self.model.radiusProperty.get() );
      // Investigating additional processing from mvt
      self.model.xScaleProperty.set( mvt.modelToViewDeltaY( xScale ) / 210 );
      console.log( 'xScale ', self.model.xScaleProperty );
    } );


    // spring constant determines lineWidth
    //springMassSystem.spring.springConstantProperty.link( function( springConstant ) {
    //  var lineWidth = options.minLineWidth + options.deltaLineWidth * ( springConstant - springMassSystem.spring.springConstantRange.min );
    //  self.model.lineWidthProperty.set( lineWidth );
    //} );

  }

  massesAndSprings.register( 'SpringNode', SpringNode );

  return inherit( ParametricSpringNode, SpringNode );

} );
