// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett
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
    // @public {read-write} set title
    this.title = title;

    // @public {read-write} set gravity acceleration
    this.gravity = gravity;
  }

  massesAndSprings.register( 'Body', Body );

  inherit( Object, Body );

  Body.MOON = new Body( bodyMoonString, 1.62 );
  Body.EARTH = new Body( bodyEarthString, 9.81 );
  Body.JUPITER = new Body( bodyJupiterString, 24.79 );
  Body.PLANET_X = new Body( bodyPlanetXString, 14.2 );
  Body.ZERO_G = new Body( bodyZeroGString, 0 );
  Body.CUSTOM = new Body( bodyCustomString, null );

  return Body;
} );