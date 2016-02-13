// Copyright 2015-2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  //var Range = require( 'DOT/Range' );

  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} equilibriumLength - resting length of unweighted spring in m
   * @param {Range} springConstantRange - k in N/m
   *
   * @constructor
   */
  function Spring( position, equilibriumLength, springConstantRange ) {
    var self  = this;


    // validate and save options
    assert && assert( equilibriumLength > 0, 'equilibriumLength must be > 0 : ' + equilibriumLength );
    this.equilibriumLength = equilibriumLength; // @public read-only

    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : ' + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //assert && assert( options.displacementRange );
    //this.displacementRange = options.displacementRange; // @public read-only


    this.springConstantRange = springConstantRange;

    //------------------------------------------------
    // Properties
    PropertySet.call( this, {
      displacement: 0,  // {number} units: m
      springConstant: this.springConstantRange.defaultValue,  // {number} units N/m
      top: position.y,
      position: position,
      equilibriumLength: equilibriumLength, // {number} units: m
      animating: false, // {boolean}
      mass: null // {Mass}
    } );

    //------------------------------------------------
    // Derived properties

    // @public x location of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.equilibriumLengthProperty, this.displacementProperty ],
      function( equilibriumLength, displacement ) {
        var top = self.topProperty.get();
        var bottom = top - equilibriumLength + displacement;
        assert && assert( bottom - top > 0, 'bottom must be > top, bottom=' + bottom + ', top=' + top );
        return bottom;
      } );

    // @public length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.equilibriumLengthProperty, this.displacementProperty ],
      function( equilibriumLength, displacement ) {
        var length = equilibriumLength - displacement;
        console.log( 'Model length ' + length );
        return length;
      } );

    //------------------------------------------------
    // Property observers

    // k: When spring constant changes, adjust either displacement or applied force
    this.springConstantProperty.link( function( springConstant ) {
      assert && assert( self.springConstantRange.contains( springConstant ), 'springConstant is out of range: ' + springConstant );
        // TODO: calculate displacement and/or period based on attached mass and new spring constant
        // self.displacement = self.appliedForce / springConstant; // x = F/k
    } );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( PropertySet, Spring, {

    removeMass: function() {
      PropertySet.prototype.reset.call( this );
    },

    addMass: function ( mass, gravity ) {
      //this.removeMass();
      this.mass = mass;
      //this.mass.spring = this;
      //this.equilibriumLength += this.mass.mass * gravity / this.springConstant;
      //this.period = 2 * Math.PI * Math.sqrt( this.mass.mass / this.springConstant );
      //this.displacement = this.mass.position.y - this.equilibriumLength;
      //this.mass.verticalVelocity = 0;
      this.animating = true;
    },

    oscillate: function( gravity, friction, dt ) {
      if ( this.animating ) {
        //update position
        //update velocity??
        //update acceleration??
      }
    }


  } );

} );
