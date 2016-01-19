// Copyright 2015, University of Colorado Boulder

/**
 * Model of a spring, contains purely model properties.
 * The left end is attached to something like a wall or another spring.
 * A force is applied to the right end, by something like a robotic arm or another spring.
 *
 * Either displacement range or applied force range must be specified, but not both.
 * The unspecified range is computed, and whichever range is not specified is the
 * quantity that changes when spring constant is modified. For example, if applied force
 * range is specified, then displacement range is computed, and changing spring constant
 * will modify displacement.
 *
 * Model equations:
 *
 * F = k * x
 * E = ( k * x * x ) / 2
 *
 * where:
 *
 * F = applied force, N/m
 * k = spring constant, N/m
 * x = displacement from equilibrium position, m
 * E = potential energy, J
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Spring( options ) {

    options = _.extend( {
      left: 0, // {number} x location of the left end of the spring, units = m
      equilibriumLength: 1.5, // {number} length of the spring at equilibrium, units = m
      springConstantRange: new Range( 100, 1000, 200 ), // {Range} spring constant range and initial value, units = N/m
      displacementRange: null, // {Range} displacement range and initial value, units = m
      appliedForceRange: null, // {Range} applied force range and initial value, units = N
      appliedForceDelta: 1 // {number} applied force (and thus spring force) are constrained to this delta
    }, options );

    // validate and save options
    assert && assert( options.equilibriumLength > 0, 'equilibriumLength must be > 0 : ' + options.equilibriumLength );
    this.equilibriumLength = options.equilibriumLength; // @public read-only

    assert && assert( options.springConstantRange.min > 0, 'minimum spring constant must be positive : ' + options.springConstantRange.min );
    this.springConstantRange = options.springConstantRange; // @public read-only

    assert && assert( options.appliedForceDelta > 0, 'appliedForceDelta must be > 0 : ' + options.appliedForceDelta );
    this.appliedForceDelta = options.appliedForceDelta; // @public read-only

    // Either applied force range or displacement range can be specified, the other is computed.
    assert && assert( options.displacementRange && !options.appliedForceRange || !options.displacementRange && options.appliedForceRange,
      'specify either displacementRange or appliedForceRange, but not both' );
    if ( options.appliedForceRange ) {
      this.appliedForceRange = options.appliedForceRange; // read-only

      // x = F/k, read-only
      this.displacementRange = new Range( this.appliedForceRange.min / this.springConstantRange.min,
        this.appliedForceRange.max / this.springConstantRange.min,
        this.appliedForceRange.defaultValue / this.springConstantRange.defaultValue );
    }
    else {
      this.displacementRange = options.displacementRange; // read-only

      // F = kx, read-only
      this.appliedForceRange = new Range( this.springConstantRange.max * this.displacementRange.min,
        this.springConstantRange.max * this.displacementRange.max,
        this.springConstantRange.defaultValue * this.displacementRange.defaultValue );
    }

    var thisSpring = this;

    //------------------------------------------------
    // Properties

    PropertySet.call( this, {
      // @public
      appliedForce: this.appliedForceRange.defaultValue, // {number} F
      springConstant: this.springConstantRange.defaultValue,  // {number} k
      displacement: this.displacementRange.defaultValue,  // {number} x
      left: options.left // {number} location of the left end of the spring, units = m
    }, options );

    //------------------------------------------------
    // Derived properties

    // @public -F, spring force opposes the applied force, units = N
    this.springForceProperty = new DerivedProperty( [ this.appliedForceProperty ],
      function( appliedForce ) {
        return -appliedForce;
      } );

    // @public equilibrium x location, units = m
    this.equilibriumXProperty = new DerivedProperty( [ this.leftProperty ],
      function( left ) {
        return left + thisSpring.equilibriumLength;
      } );

    // @public x location of the right end of the spring, units = m
    this.rightProperty = new DerivedProperty( [ this.equilibriumXProperty, this.displacementProperty ],
      function( equilibriumX, displacement ) {
        var left = thisSpring.leftProperty.get();
        var right = equilibriumX + displacement;
        assert && assert( right - left > 0, 'right must be > left, right=' + right + ', left=' + left );
        return right;
      } );

    /**
     * @public
     * Range of the right end of the spring, units = m
     * Derivation differs depending on whether changing spring constant modifies applied force or displacement.
     */
    this.rightRangeProperty = null;
    if ( options.appliedForceRange ) {
      this.rightRangeProperty = new DerivedProperty( [ this.springConstantProperty, this.equilibriumXProperty ],
        function( springConstant, equilibriumX ) {
          var minDisplacement = thisSpring.appliedForceRange.min / springConstant;
          var maxDisplacement = thisSpring.appliedForceRange.max / springConstant;
          return new Range( equilibriumX + minDisplacement, equilibriumX + maxDisplacement );
        } );
    }
    else {
      this.rightRangeProperty = new DerivedProperty( [ this.equilibriumXProperty ],
        function( equilibriumX ) {
          return new Range( equilibriumX + thisSpring.displacementRange.min, equilibriumX + thisSpring.displacementRange.max
          );
        } );
    }

    // @public length of the spring, units = m
    this.lengthProperty = new DerivedProperty( [ this.leftProperty, this.rightProperty ],
      function( left, right ) {
        return Math.abs( right - left );
      } );

    // @public potential energy, E = ( k1 * x1 * x1 ) / 2
    this.energyProperty = new DerivedProperty( [ this.springConstantProperty, this.displacementProperty ],
      function( springConstant, displacement ) {
        return ( springConstant * displacement * displacement ) / 2;
      } );

    //------------------------------------------------
    // Property observers

    // F: When applied force changes, maintain the spring constant, change displacement.
    this.appliedForceProperty.link( function( appliedForce ) {
      assert && assert( thisSpring.appliedForceRange.contains( appliedForce ), 'appliedForce is out of range: ' + appliedForce );
      thisSpring.displacement = appliedForce / thisSpring.springConstant; // x = F/k
    } );

    // k: When spring constant changes, adjust either displacement or applied force
    this.springConstantProperty.link( function( springConstant ) {
      assert && assert( thisSpring.springConstantRange.contains( springConstant ), 'springConstant is out of range: ' + springConstant );
      if ( options.appliedForceRange ) {
        // if the applied force range was specified, then maintain the applied force, change displacement
        thisSpring.displacement = thisSpring.appliedForce / springConstant; // x = F/k
      }
      else {
        // if the displacement range was specified, maintain the displacement, change applied force
        thisSpring.appliedForce = springConstant * thisSpring.displacement; // F = kx
      }
    } );

    // x: When displacement changes, maintain the spring constant, change applied force.
    this.displacementProperty.link( function( displacement ) {
      assert && assert( thisSpring.displacementRange.contains( displacement ), 'displacement is out of range: ' + displacement );
      var appliedForce = thisSpring.springConstant * displacement; // F = kx
      // constrain to delta if the applied force range was specified
      if ( options.appliedForceRange ) {
        appliedForce = Math.round( appliedForce / options.appliedForceDelta ) * options.appliedForceDelta;
      }
      // constrain to range
      thisSpring.appliedForce = thisSpring.appliedForceRange.constrainValue( appliedForce );
    } );
  }



  return inherit( PropertySet, Spring );
} );
