// Copyright 2016-2022, University of Colorado Boulder

/**
 * Responsible for the attributes associated with each planet.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';

const bodyCustomString = MassesAndSpringsStrings.body.custom;
const bodyEarthString = MassesAndSpringsStrings.body.earth;
const bodyJupiterString = MassesAndSpringsStrings.body.jupiter;
const bodyMoonString = MassesAndSpringsStrings.body.moon;
const bodyPlanetXString = MassesAndSpringsStrings.body.planetX;

class Body {
  /**
   * @param {string} title - name of body.
   * @param {number|null} gravity - gravitational acceleration of body.
   */
  constructor( title, gravity ) {

    // @public {string}
    this.title = title;

    // @public {number|null} gravity acceleration (m/s^2)
    this.gravity = gravity;
  }
}

massesAndSprings.register( 'Body', Body );

// @public {Body} (read-only) body objects for gravity panel
Body.MOON = new Body( bodyMoonString, MassesAndSpringsConstants.MOON_GRAVITY );
Body.EARTH = new Body( bodyEarthString, MassesAndSpringsConstants.EARTH_GRAVITY );
Body.JUPITER = new Body( bodyJupiterString, MassesAndSpringsConstants.JUPITER_GRAVITY );
Body.PLANET_X = new Body( bodyPlanetXString, MassesAndSpringsConstants.PLANET_X );
Body.CUSTOM = new Body( bodyCustomString, MassesAndSpringsConstants.EARTH_GRAVITY );
Body.BODIES = [ Body.MOON, Body.EARTH, Body.JUPITER, Body.PLANET_X, Body.CUSTOM ];

Body.BodyIO = new IOType( 'BodyIO', {
  valueType: Body,
  documentation: 'Planet which determines the force of gravity.',
  supertype: ReferenceIO( IOType.ObjectIO )
} );

export default Body;