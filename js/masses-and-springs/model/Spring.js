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

    this.position = position;
    this.springConstantRange = springConstantRange;

    //------------------------------------------------
    // Properties
    PropertySet.call( this, {
      // @public (read-only)
      springConstant: this.springConstantRange.defaultValue,  // {number} units N/m
      displacement: 0,  // {number} units: m
      equilibriumLength: equilibriumLength, // {number} units: m
      animating: false, // {boolean}
      mass: null // {Mass}
    } );

    //------------------------------------------------
    // Derived properties

    // @public equilibrium y location, units = m
    this.equilibriumYProperty = new DerivedProperty( [ this.topProperty ],
      function( top ) {
        return top + self.equilibriumLength;
      } );

    // @public x location of the bottom end of the spring, units = m
    this.bottomProperty = new DerivedProperty( [ this.equilibriumYProperty, this.displacementProperty ],
      function( equilibriumY, displacement ) {
        var top = self.topProperty.get();
        var bottom = equilibriumY + displacement;
        assert && assert( bottom - top > 0, 'bottom must be > top, bottom=' + bottom + ', top=' + top );
        return bottom;
      } );

    // @public length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.topProperty, this.bottomProperty ],
      function( top, bottom ) {
        return Math.abs( bottom - top );
      } );

    //------------------------------------------------
    // Property observers

    // k: When spring constant changes, adjust either displacement or applied force
    this.springConstantProperty.link( function( springConstant ) {
      assert && assert( self.springConstantRange.contains( springConstant ), 'springConstant is out of range: ' + springConstant );
        // TODO: calculate displacement and/or period based on attached mass and new spring constant
        // self.displacement = self.appliedForce / springConstant; // x = F/k
    } );

    // x: When displacement changes, maintain the spring constant, change applied force.
    this.displacementProperty.link( function( displacement ) {
      assert && assert( self.displacementRange.contains( displacement ), 'displacement is out of range: ' + displacement );
      // TODO: Do we still need this?
    } );

    this.lengthProperty.link( function( length ) {
      console.log( 'Model length ' + length );
    } );
  }

  massesAndSprings.register( 'Spring', Spring );

  return inherit( PropertySet, Spring, {

    removeMass: function() {
      PropertySet.reset();
    },

    addMass: function ( mass, gravity ) {
      this.removeMass();
      this.mass = mass;
      this.mass.spring = this;
      this.equilibriumY += this.mass.mass * gravity / this.springConstant;
      this.period = 2 * Math.PI * Math.sqrt( this.mass.mass / this.springConstant );
      this.displacement = this.mass.postion.y - this.equilibriumY;
      this.mass.verticalVelocity = 0;
      this.animating = true;
    },

    oscillate: function( gravity, friction, dt ) {
      if ( this.animating ) {
        //update postion
        //update velocity??
        //update acceleration??
      }
    }


  } );

} );
