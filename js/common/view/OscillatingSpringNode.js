// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node for handling the representation of an oscillating spring.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const ParametricSpringNode = require( 'SCENERY_PHET/ParametricSpringNode' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const LINEAR_LOOP_MAPPING = new LinearFunction( 0.1, 0.5, 2, 12 );
  const MAP_NUMBER_OF_LOOPS = function( springLength ) {
    return Util.roundSymmetric( LINEAR_LOOP_MAPPING( springLength ) );
  };

  /**
   * @param {Spring} spring
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function OscillatingSpringNode( spring, modelViewTransform2, tandem, options ) {
    const self = this;

    options = _.extend( {
      deltaPhase: 3 * Math.PI / 2,
      loops: MAP_NUMBER_OF_LOOPS( spring.lengthProperty.get() ), // {number} number of loops in the coil
      pointsPerLoop: 28, // {number} number of points per loop
      radius: 6.5, // {number} radius of a loop with aspect ratio of 1:1
      aspectRatio: 4, // {number} y:x aspect ratio of the loop radius
      unitDisplacementLength: modelViewTransform2.viewToModelDeltaY( 1 ), // {number} view length of 1 meter of displacement
      minLineWidth: 1, // {number} lineWidth used to stroke the spring for minimum spring constant
      deltaLineWidth: 1.5, // increase in line width per 1 unit of spring constant increase
      leftEndLength: -15, // {number} length of the horizontal line added to the left end of the coil
      rightEndLength: -15, // {number} length of the horizontal line added to the right end of the coil
      rotation: Math.PI / 2, // {number} angle in radians of rotation of spring,
      pathBoundsMethod: 'safePadding',
      tandem: tandem
    }, options );

    ParametricSpringNode.call( this, options );

    // @public {Spring} (read-only)
    this.spring = spring;

    this.translation = modelViewTransform2.modelToViewPosition(
      new Vector2( spring.positionProperty.get().x,
        spring.positionProperty.get().y - length ) );

    function updateViewLength() {

      // ParametricSpringNode calculations
      // Value of coilStretch is in view coordinates and doesn't have model units.
      const coilStretch = (
        modelViewTransform2.modelToViewDeltaY( spring.lengthProperty.get() )
        - ( options.leftEndLength + options.rightEndLength) );
      const xScale = coilStretch / ( self.loopsProperty.get() * self.radiusProperty.get() );

      // The wrong side of the PSN is static, so we have to put the spring in reverse and update the length AND position.
      // Spring is rotated to be rotated so XScale relates to Y-direction in view
      self.xScaleProperty.set( xScale );
      self.y = modelViewTransform2.modelToViewY( spring.positionProperty.get().y - spring.lengthProperty.get() );
    }

    // Link exists for sim duration. No need to unlink.
    spring.naturalRestingLengthProperty.link( function( springLength ) {
      self.loopsProperty.set( MAP_NUMBER_OF_LOOPS( springLength ) );
      updateViewLength();
    } );

    // Link exists for sim duration. No need to unlink.
    spring.lengthProperty.link( function() {
      updateViewLength();
    } );

    // ParametricSpringNode width update. SpringConstant determines lineWidth
    // Link exists for sim duration. No need to unlink.
    spring.thicknessProperty.link( function( thickness ) {
      self.lineWidthProperty.set( thickness );
    } );
  }

  massesAndSprings.register( 'OscillatingSpringNode', OscillatingSpringNode );

  return inherit( ParametricSpringNode, OscillatingSpringNode, {
    /**
     * @public
     */
    reset: function() {
      ParametricSpringNode.prototype.reset.call( this );
      this.spring.reset();
    }
  }, {
    MAP_NUMBER_OF_LOOPS: MAP_NUMBER_OF_LOOPS
  } );
} );