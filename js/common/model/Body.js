// Copyright 2016-2018, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  const bodyCustomString = require( 'string!MASSES_AND_SPRINGS/body.custom' );
  const bodyEarthString = require( 'string!MASSES_AND_SPRINGS/body.earth' );
  const bodyJupiterString = require( 'string!MASSES_AND_SPRINGS/body.jupiter' );
  const bodyMoonString = require( 'string!MASSES_AND_SPRINGS/body.moon' );
  const bodyPlanetXString = require( 'string!MASSES_AND_SPRINGS/body.planetX' );

  /**
   * @param {string} title - name of body.
   * @param {number|null} gravity - gravitational acceleration of body.
   * @constructor
   */
  function Body( title, gravity ) {

    // @public {string}
    this.title = title;

    // @public {number|null} gravity acceleration (m/s^2)
    this.gravity = gravity;
  }

  massesAndSprings.register( 'Body', Body );

  inherit( Object, Body );

  // @public {Body} (read-only) body objects for gravity panel
  Body.MOON = new Body( bodyMoonString, MassesAndSpringsConstants.MOON_GRAVITY );
  Body.EARTH = new Body( bodyEarthString, MassesAndSpringsConstants.EARTH_GRAVITY );
  Body.JUPITER = new Body( bodyJupiterString, MassesAndSpringsConstants.JUPITER_GRAVITY );
  Body.PLANET_X = new Body( bodyPlanetXString, MassesAndSpringsConstants.PLANET_X );
  Body.CUSTOM = new Body( bodyCustomString, MassesAndSpringsConstants.EARTH_GRAVITY );
  Body.BODIES = [ Body.MOON, Body.EARTH, Body.JUPITER, Body.PLANET_X, Body.CUSTOM ];

  return Body;
} );