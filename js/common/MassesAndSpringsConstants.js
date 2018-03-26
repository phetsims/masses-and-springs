// Copyright 2017-2018, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Line = require( 'SCENERY/nodes/Line' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var MassesAndSpringsConstants = {
    DEFAULT_SPRING_LENGTH: 0.5,
    RADIO_BUTTON_RADIUS: 6,

    // Ratio for dt when sim is in slow motion
    SLOW_SIM_DT_RATIO: 8,

    // Y position of floor in meters. The floor is at the bottom bounds of the screen.
    FLOOR_Y: 0,

    // Y position of ceiling in meters. The ceiling is the top of the SpringHangerNode, just below the top of the dev view bounds
    CEILING_Y: 1.47,

    // Shelf height, in meters, from the bottom and top of the shelf.
    SHELF_HEIGHT: 0.02,

    // Hook height in meters. Measured from the bottom of the hook not the screen
    HOOK_HEIGHT: 0.037,

    // Center of the hook. Used as an attachment point for the massNodes
    HOOK_CENTER: 0.037 / 2,

    // {RangeWithValue} range of damping associated with sim
    DAMPING_RANGE: new RangeWithValue( 0, 0.7, 0.3 ),

    // {RangeWithValue} range of gravitational acceleration associated with each planet
    GRAVITY_RANGE: new RangeWithValue( 0, 30, 9.8 ),

    // {RangeWithValue} range of gravitational acceleration associated with each planet
    SPRING_CONSTANT_RANGE: new RangeWithValue( 3, 12, 6 ),

    // Constants for vectors
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    GRAVITY_ARROW_COLOR: 'rgb( 236, 63, 71 )',
    SPRING_ARROW_COLOR: 'rgb( 36, 36, 255 )',

    // Constants for planets' gravity
    EARTH_GRAVITY: 9.81,
    MOON_GRAVITY: 1.62,
    JUPITER_GRAVITY: 24.79,
    PLANET_X: 14.2,

    // Constants regarding fonts
    LABEL_FONT: new PhetFont( 12 ),
    TITLE_FONT: new PhetFont( 14 ),

    // Constants regarding panels
    PANEL_VERTICAL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,
    PANEL_MAX_WIDTH: 175,
    PANEL_MIN_WIDTH: 190,
    FORCES_STRING: 'forces', //REVIEW: Use enum instead
    NET_FORCE_STRING: 'netForce', //REVIEW: Use enum instead
    PANEL_FILL: 'rgb(230,230,230)',
    THUMB_HIGHLIGHT: '#71EDFF',
    LINE_SEPARATOR: function( length ) {
      return new Line( 0, 0, length, 0, { stroke: 'gray' } );
    },

    RIGHT_SPRING_X: 1.3 // {number} X position of the spring node in screen coordinates
  };

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );