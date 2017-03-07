// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var bodyCustomString = require( 'string!MASSES_AND_SPRINGS/body.custom' );
  var bodyEarthString = require( 'string!MASSES_AND_SPRINGS/body.earth' );
  var bodyJupiterString = require( 'string!MASSES_AND_SPRINGS/body.jupiter' );
  var bodyMoonString = require( 'string!MASSES_AND_SPRINGS/body.moon' );
  var bodyPlanetXString = require( 'string!MASSES_AND_SPRINGS/body.planetX' );
  var bodyZeroGString = require( 'string!MASSES_AND_SPRINGS/body.zeroG' );

  /**
   * @param {string} title of body.
   * @param {number|null} gravity acceleration of body.
   * @param {Tandem} tandem
   * @constructor
   */
  function Body( title, gravity, tandem ) {
    // @public {read-write} set title
    this.title = title;

    // @public {read-write} set gravity acceleration
    this.gravity = gravity;
  }

  massesAndSprings.register( 'Body', Body );

  inherit( Object, Body );

  // A new tandem instance is required here since the bodies are created statically.
  var tandem = Tandem.createStaticTandem( 'bodies' );

  Body.MOON = new Body( bodyMoonString, 1.62, tandem.createTandem( 'moon' ) );
  Body.EARTH = new Body( bodyEarthString, 9.81, tandem.createTandem( 'earth' ) );
  Body.JUPITER = new Body( bodyJupiterString, 24.79, tandem.createTandem( 'jupiter' ) );
  Body.PLANET_X = new Body( bodyPlanetXString, 14.2, tandem.createTandem( 'planetX' ) );
  Body.ZERO_G = new Body( bodyZeroGString, 0, tandem.createTandem( 'zeroG' ) );
  Body.CUSTOM = new Body( bodyCustomString, null, tandem.createTandem( 'custom' ) );

  return Body;
} );