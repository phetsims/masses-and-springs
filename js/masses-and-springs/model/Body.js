// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  // strings
  var bodyCustomString = require( 'string!MASSES_AND_SPRINGS/body.custom' );
  var bodyEarthString = require( 'string!MASSES_AND_SPRINGS/body.earth' );
  var bodyJupiterString = require( 'string!MASSES_AND_SPRINGS/body.jupiter' );
  var bodyMoonString = require( 'string!MASSES_AND_SPRINGS/body.moon' );
  var bodyPlanetXString = require( 'string!MASSES_AND_SPRINGS/body.planetX' );
  var bodyZeroGString = require( 'string!MASSES_AND_SPRINGS/body.zeroG' );

  /**
   * @param {string} title of body.
   * @param {number} gravity acceleration of body.
   * @constructor
   */
  function Body( title, gravity ) {
    // set title
    this.title = title;

    // set gravity acceleration
    this.gravity = gravity;
  }

  massesAndSprings.register( 'Body', Body );

  return inherit( Object, Body, {}, {
    MOON: new Body( bodyMoonString, 1.62 ),
    EARTH: new Body( bodyEarthString, 9.81 ),
    JUPITER: new Body( bodyJupiterString, 24.79 ),
    PLANET_X: new Body( bodyPlanetXString, 14.2 ),
    ZERO_G: new Body( bodyZeroGString, 0 ),
    CUSTOM: new Body( bodyCustomString, null )
  } );
} );