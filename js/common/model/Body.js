// Copyright 2016-2018, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var bodyCustomString = require( 'string!MASSES_AND_SPRINGS/body.custom' );
  var bodyEarthString = require( 'string!MASSES_AND_SPRINGS/body.earth' );
  var bodyJupiterString = require( 'string!MASSES_AND_SPRINGS/body.jupiter' );
  var bodyMoonString = require( 'string!MASSES_AND_SPRINGS/body.moon' );
  var bodyPlanetXString = require( 'string!MASSES_AND_SPRINGS/body.planetX' );

  /**
   * @param {string} title - name of body.
   * @param {number|null} gravity - gravitational acceleration of body.
   * @param {Tandem} tandem
   * @constructor
   */
  function Body( title, gravity, tandem ) {

    // @public {string}
    this.title = title;

    // @public {number|null} gravity acceleration (m/s^2)
    this.gravity = gravity;
  }

  massesAndSprings.register( 'Body', Body );

  inherit( Object, Body );

  // A new tandem instance is required here since the bodies are created statically.
  var tandem = Tandem.rootTandem.createTandem( 'bodies' );

  // @public {Body} (read-only) body objects for gravity panel
  Body.MOON = new Body( bodyMoonString, MassesAndSpringsConstants.MOON_GRAVITY, tandem.createTandem( 'moon' ) );
  Body.EARTH = new Body( bodyEarthString, MassesAndSpringsConstants.EARTH_GRAVITY, tandem.createTandem( 'earth' ) );
  Body.JUPITER = new Body( bodyJupiterString, MassesAndSpringsConstants.JUPITER_GRAVITY, tandem.createTandem( 'jupiter' ) );
  Body.PLANET_X = new Body( bodyPlanetXString, MassesAndSpringsConstants.PLANET_X, tandem.createTandem( 'planetX' ) );
  Body.CUSTOM = new Body( bodyCustomString, null, tandem.createTandem( 'custom' ) );

  return Body;
} );