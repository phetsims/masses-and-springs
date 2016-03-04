// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Spring = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Spring' );
  var Mass = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Mass' );
  var MASRuler = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/MASRuler' );

  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MassesAndSpringsModel() {
    this.floorY = 0; // Y position of floor in m
    this.ceilingY = 1.2; // Y position of floor in m
    this.springs = [
      new Spring( new Vector2( .50, this.ceilingY ), .50, new Range( 0, 10, .3), new Range( 0, 5, 0 ) ),
      new Spring( new Vector2( .80, this.ceilingY ), .50, new Range( 0, 10, .3), new Range( 0, 5, 0 ) )
    ];
    this.ruler = new MASRuler( new Vector2( .15, this.ceilingY ) );
    this.masses = [
      new Mass( .250, new Vector2( .275, .5 ) ),
      new Mass( .100, new Vector2(.4, .5 ) ),
      new Mass( .050, new Vector2( .5, .5 ) ),
      new Mass( .150, new Vector2( .775, .5 ) ),
      new Mass( .075, new Vector2( .9, .5 ) ),
      new Mass( .200, new Vector2( 1.025, .5 ) )
    ];
    this.gravityRange = new Range( 0, 30, 9.8 );

    PropertySet.call( this, {
      timeRate: 1.0,// {number} r - rate of time passed.  r < 0 is reverse, 0 < r < 1 is slow motion, r > 1 is fast forward.
      friction: 0, // {number} b - coefficient of friction
      gravity: 9.8, // {number} a - gravitational acceleration (positive)
      referenceLinePosition: new Vector2( .4, .7 )
    });
  }

  massesAndSprings.register( 'MassesAndSpringsModel', MassesAndSpringsModel );

  return inherit( PropertySet, MassesAndSpringsModel, {

    // @public
    reset: function() {
      this.masses.forEach( function(mass) { mass.reset(); });
      this.springs.forEach( function( system ) { system.reset(); } );
    },

    // @public
    step: function( dt ) {
      var mass = null;
      var spring = null;
      var i = 0;
      var j = 0;
      var grabbingDistance = .1;
      var droppingDistance = .2;

      for ( i in this.masses ) {
        mass = this.masses[i];

        // Fall if not hung or grabbed
        if ( mass.spring === null && !mass.userControlled ) {
          mass.fallWithGravity( this.gravity, this.floorY, dt );
        }

        // If mass is close to the end of a spring hang it and update displacement
        else if ( mass.userControlled ) {
          for ( j in this.springs ) {
            spring = this.springs[j];

            if ( mass.spring === null && Math.abs( mass.position.y - spring.bottomProperty.get() ) <= grabbingDistance && Math.abs( mass.position.x - spring.position.x ) <= grabbingDistance ) {
              if (spring.mass === null) {
                spring.addMass( mass, this.gravity );
                mass.spring = spring;
              }
              else {
                spring.removeMass();
                spring.addMass( mass, this.gravity );
                mass.spring = spring;
              }

            }
            else if ( mass.spring === spring && Math.abs( mass.position.x - spring.position.x ) <= droppingDistance ) {
              spring.displacement = mass.position.y - ( spring.top - spring.equilibriumLength );
            }
            else if ( mass.spring === spring && Math.abs( mass.position.x - spring.position.x ) > droppingDistance ) {
              spring.removeMass();
              mass.spring = null;
            }
          }
        }
      }

      // Oscillate springs
      for ( i in this.springs) {
        spring = this.springs[i];
        if ( spring.animating && !spring.mass.userControlled ) {
          spring.oscillate( this.gravity, this.friction, dt );
        }
      }
    }
  } );
} );