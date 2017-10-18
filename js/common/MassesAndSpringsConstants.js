// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector2 = require( 'DOT/Vector2' );

  var MassesAndSpringsConstants = {
    //TODO: Insert constants here
    MAX_TEXT_WIDTH: 80,
    DEFAULT_SPRING_LENGTH: 0.5,

    // Ratio for dt when sim is in slow motion
    SIM_DT_RATIO: 8,

    // Y position of floor in meters. The floor is at the bottom bounds of the screen.
    FLOOR_Y: 0,

    // Y position of ceiling in meters. The ceiling is the top of the SpringHangerNode, just below the top of the dev view bounds
    CEILING_Y: 1.23,

    // {Property.<number>} range of friction associated with sim
    FRICTION_RANGE_PROPERTY: new Property( new RangeWithValue( 0, 1, .2 ) ),

    // {Property.<number>} range of gravitational acceleration associated with each planet
    GRAVITY_RANGE_PROPERTY: new Property( new RangeWithValue( 0, 30, 9.8 ) ),

    // Constants for vectors
    VECTOR_ARROW_LENGTH: 34,
    FORCES_ARROW_LENGTH: 31,
    ARROW_HEAD_WIDTH: 14,
    ARROW_TAIL_WIDTH: 8,
    SMALLER_ARROW_HEAD_WIDTH: 11,
    SMALLER_ARROW_TAIL_WIDTH: 3,
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    GRAVITY_ARROW_COLOR: 'rgb( 236, 63, 71 )',
    SPRING_ARROW_COLOR: 'rgb( 36, 36, 255 )',

    // Constants for planets' gravity
    EARTH_GRAVITY: 9.81,
    MOON_GRAVITY: 1.62,
    JUPITER_GRAVITY: 24.79,
    PLANET_X: 14.2,
    ZERO_G: 0,

    // Constants regarding fonts
    FONT: new PhetFont( 12 ),
    LABEL_FONT: new PhetFont( 10 ),
    TITLE_FONT: new PhetFont( { size: 12, weight: 'bold' } ),

    // Constants regarding panels
    PANEL_VERTICAL_SPACING: 10,
    PANEL_CORNER_RADIUS: 7,
    PANEL_MAX_WIDTH: 170,
    PANEL_MIN_WIDTH: 170,
    FORCES_STRING: 'forces',
    NET_FORCE_STRING: 'netForce',
    PANEL_FILL: 'rgb( 240, 240, 240 )',

    RIGHT_SPRING_X: 0.975, // {number} X position of the spring node in screen coordinates


    MODEL_VIEW_TRANSFORM: function( bounds, ratio ) {
        return ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          Vector2.ZERO,
          new Vector2( 0, bounds.height * ratio ),
          397 );
      }
    }
  ;

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );