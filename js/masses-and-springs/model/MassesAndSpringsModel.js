// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var SpringSystem = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/SpringSystem' );

  /**
   * @constructor
   */
  function MassesAndSpringsModel() {


    var springOptions = {
      springConstantRange: new Range( 100, 1000, 200 ), // units = N/m
      appliedForceRange: new Range( -100, 100, 0 ), // units = N
    };

    this.system = new SpringSystem( springOptions );
    this.springDirection = 1;
    this.springVelocity = 0;
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( Object, MassesAndSpringsModel, {

    // @public
    reset: function() {
      //this.massList.forEach( function( mass ) {
      //  mass.positionProperty.reset();
      //  mass.rotationAngleProperty.reset();
      //} );
      //BalanceModel.prototype.reset.call( this );

      this.system.reset();
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
      if (this.system.spring.appliedForce === this.system.spring.appliedForceRange.max || this.system.spring.appliedForce === this.system.spring.appliedForceRange.min) {
        this.springDirection = this.springDirection * -1;
      }
      this.system.spring.appliedForce = this.system.spring.appliedForce + this.springDirection * this.springVelocity;
    }
  } );
} );