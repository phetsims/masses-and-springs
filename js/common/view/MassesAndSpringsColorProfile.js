// Copyright 2018, University of Colorado Boulder

/**
 * Profile used for colors dependent on the basics version.
 *
 * There are two profiles, 'default' and 'basics' (for the Basics version of the sim)
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  // Initialize colors for each profile, by string key. If a basics color is not defined, it will take the
  // 'default' value provided.
  var MassesAndSpringsColorProfile = new ColorProfile( [ 'default', 'basics' ], {
    background: {
      default: Color.white,
      basics: new Color( 'rgb( 255, 250, 227 )' )
    },
    smallMysteryMass: {
      default: new Color( 'rgb( 246, 164, 255 )' ),
      basics: new Color( 'rgb( 185, 0, 38 )' )
    },
    mediumMysteryMass: {
      default: new Color( 'rgb( 0, 222, 224 )' ),
      basics: new Color( 'rgb( 0, 107, 161 )' )
    },
    largeMysteryMass: {
      default: new Color( 'rgb( 250, 186, 75)' ),
      basics: new Color( 'rgb( 0, 104, 55 )' )
    },
    labeledMass: {
      default: new Color( 'rgb( 153, 153, 153 )' ),
      basics: new Color( 'rgb( 153, 153, 153 )' )
    },
    adjustableMass: {
      default: new Color( 'rgb( 247, 151, 34 )' ),
      basics: new Color( 'rgb( 247, 151, 34 )' )
    },
    unstretchedLength: {
      default: new Color( 'rgb( 65, 66, 232 )' )
    },
    restingPosition: {
      default: new Color( 'rgb( 0, 180, 0 )' )
    },
    movableLine: {
      default: new Color( 'rgb( 255, 0, 0 )' )
    },
    velocityVector: {
      default: new Color( 'rgb( 41, 253, 46 )' )
    },
    accelerationVector: {
      default: new Color( 'rgb( 255, 253, 56 )' )
    }
  } );

  massesAndSprings.register( 'MassesAndSpringsColorProfile', MassesAndSpringsColorProfile );

  return MassesAndSpringsColorProfile;
} );

