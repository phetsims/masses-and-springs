// Copyright 2016-2018, University of Colorado Boulder

/**
 * Lab model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var PeriodTrace = require( 'MASSES_AND_SPRINGS/lab/model/PeriodTrace' );
  var Property = require( 'AXON/Property' );

  // constants
  var MASS_OFFSET = 0.15;

  /**
   * @param {Tandem} tandem
   * @param {object} options
   *
   * @constructor
   */
  function LabModel( tandem, options ) {

    MassesAndSpringsModel.call( this, tandem, options );

    // Lab screen shouldn't have spring damping for non-basics version
    this.dampingProperty = new NumberProperty( this.options.basicsVersion ? 0 : 0.0575 );

    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    // @private {boolean} Flag used to determine if this is the basics version.
    this.basicsVersion = this.options.basicsVersion; // REVIEW: Don't have `this.options` in general
    var massXPosition = this.basicsVersion ? 0.13 : 0.625;
    var massValue;
    var color;

    this.createMass( 0.100, massXPosition, MassesAndSpringsColorProfile.adjustableMassProperty, null, tandem.createTandem( 'adjustableMass' ), {
      adjustable: true
    } );

    // Initialize additional mass for basics version
    if ( this.basicsVersion ) {

      // @public {BooleanProperty}
      this.gravityAccordionBoxExpandedProperty = new BooleanProperty( false );

      this.createMass( 0.180, massXPosition + MASS_OFFSET * 2, new Property( new Color( 'rgb( 195, 51, 115 )' ) ), null, tandem.createTandem( 'largeMysteryMass' ), {
        density: this.basicsVersion ? 80 : 120,
        mysteryLabel: true
      } );
    }

    // Initialize masses for non-basics version
    // REVIEW: This code seems to be running for both versions. Is that correct?
    massValue = this.basicsVersion ? 0.12 : 0.23;
    color = this.basicsVersion ? new Color( 'rgb( 9, 19, 174 )' ) : new Color( 'rgb( 0, 222, 224 )' );
    this.createMass( massValue, massXPosition + MASS_OFFSET * 1.5, new Property( color ), null, tandem.createTandem( 'mediumMysteryMass' ), {
      density: this.basicsVersion ? 80 : 110,
      mysteryLabel: true
    } );

    massValue = this.basicsVersion ? 0.060 : 0.37;
    // REVIEW: `new Color( 'rgb(a,b,c)' )` is equivalent to `new Color( a, b, c )` if that's more helpful.
    color = this.basicsVersion ? new Color( 'rgb( 10, 198, 157 )' ) : new Color( 'rgb( 246, 164, 255 )' );
    this.createMass( massValue, massXPosition + MASS_OFFSET, new Property( color ), null, tandem.createTandem( 'smallMysteryMass' ), {
      density: this.basicsVersion ? 80 : 220,
      mysteryLabel: true
    } );

    // Initialize period trace.
    this.periodTrace = new PeriodTrace( this.springs[ 0 ], this.playingProperty );
  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel, {
    /**
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );

      // REVIEW: Usually just check `this.someProperty && this.someProperty.reset();`
      if ( this.basicsVersion ) {
        this.gravityAccordionBoxExpandedProperty.reset();
      }
    }
  } );
} );