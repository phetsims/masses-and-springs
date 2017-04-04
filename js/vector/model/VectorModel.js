// Copyright 2016-2017, University of Colorado Boulder

/**
 * Vector model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * TODO:: There has to be a better way to manage all of these properties as one entity without using propertySet()
   * @constructor
   */
  function VectorModel( tandem ) {
    var self = this;
    MassesAndSpringsModel.call( this, tandem );

    this.velocityVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'velocityVectorVisibilityProperty' )
    } );

    // this.velocityVectorPositionProperty = new Property(Vector2(0,0));

    this.accelerationVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'accelerationVectorVisibilityProperty' )
    } );

    this.forcesVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'forceVectorVisibilityProperty' )
    } );

    this.netForceVectorVisibilityProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'netForceVectorVisibilityProperty' )
    } );

    this.massAttachedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'massAttachedProperty' )
    } );

    // add velocity arrows if necessary
    // for ( var mass in self.masses ) {
    //   if ( !self.masses.hasOwnProperty( mass ) ) {
    //     continue;
    //   }
    //   var referencedMass = self.referenceMass(mass);
    Property.multilink( [
        this.springs[ 0 ].massProperty,
        this.springs[ 1 ].massProperty
      ],
      function( mass ) {
        // debugger;
        if ( mass ) {
          self.massAttachedProperty.set( true );
        }
        else if ( !mass ) {
          self.massAttachedProperty.set( false );
        }
      } );
    // }
  }

  massesAndSprings.register( 'VectorModel', VectorModel );

  return inherit( MassesAndSpringsModel, VectorModel, {
    /**
     * @override
     * @public
     */
    reset: function() {
      this.velocityVectorVisibilityProperty.reset();
      this.accelerationVectorVisibilityProperty.reset();
    }
  } );
} );
