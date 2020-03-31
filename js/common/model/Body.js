// Copyright 2016-2020, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import massesAndSpringsStrings from '../../massesAndSpringsStrings.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const bodyCustomString = massesAndSpringsStrings.body.custom;
const bodyEarthString = massesAndSpringsStrings.body.earth;
const bodyJupiterString = massesAndSpringsStrings.body.jupiter;
const bodyMoonString = massesAndSpringsStrings.body.moon;
const bodyPlanetXString = massesAndSpringsStrings.body.planetX;

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

export default Body;