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
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  /**
   * @param {Vector2} position - coordinates of the top center of the spring
   * @param {number} equilibriumLength - resting length of unweighted spring in m
   * @param {Range} springConstantRange - k in N/m
   * @param {Range} dampingCoefficientRange - c in N.s/m represents friction
   *
   * @constructor
   */
  function Spring( position, equilibriumLength, springConstantRange, dampingCoefficientRange ) {
    var self  = this;


    // validate and save options
    assert && assert( equilibriumLength > 0, 'equilibriumLength must be > 0 : ' + equilibriumLength );
    this.equilibriumLength = equilibriumLength; // @public read-only

    assert && assert( springConstantRange.min > 0, 'minimum spring constant must be positive : ' + springConstantRange.min );
    this.springConstantRange = springConstantRange; // @public read-only

    //assert && assert( options.displacementRange );
    //this.displacementRange = options.displacementRange; // @public read-only


    this.springConstantRange = springConstantRange;
    this.dampingCoefficientRange = dampingCoefficientRange;
    this.dampingRatio = null;
    this.angularFrequency = 0;

    //------------------------------------------------
    // Properties
    PropertySet.call( this, {
      displacement: 0,  // {number} units: m
      springConstant: springConstantRange.defaultValue,  // {number} units N/m
      dampingCoefficient: dampingCoefficientRange.defaultValue, // {number} units N.s/m - viscous damping (friction) coefficient of the system
      top: position.y,
      position: position,
      equilibriumLength: equilibriumLength, // {number} units: m
      animating: false, // {boolean}
      mass: null, // {Mass}
      frequency: 0,
      t: 0
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
      this.mass.spring = null;
      PropertySet.prototype.reset.call( this );
    },

    addMass: function ( mass, gravity ) {
      this.mass = mass;
      this.mass.position.x = this.position.x;
      console.log( '' + this.mass.mass + ' ' + gravity + ' ' + this.springConstant );
      //this.equilibriumLength = this.mass.mass * gravity / this.springConstant;
      this.angularFrequency = Math.sqrt( this.springConstant / this.mass.mass );
      this.dampingRatio = this.dampingCoefficient / ( 2 * Math.sqrt( this.mass.mass * this.springConstant ) );
      this.displacement =  this.mass.position.y - (this.top - this.equilibriumLength);
      this.mass.verticalVelocity = 0;
      this.animating = true;
    },

    oscillate: function( gravity, dt ) {
      if ( this.animating ) {
        var amplitude = Math.sqrt( Math.pow( gravity * this.mass.mass + this.springConstant * this.displacement, 2 )
                                   + this.springConstant * this.mass.mass * Math.pow( this.mass.verticalVelocity, 2 ) )
                        / this.springConstant;
        console.log(( this.displacement + gravity / Math.pow( this.angularFrequency, 2 ) ) / amplitude );
        var phi = Math.asin( Util.clamp( ( this.displacement + gravity / Math.pow( this.angularFrequency, 2 ) ) / amplitude, -1, 1 ) );
        phi = this.verticalVelocity <= 0 ? Math.PI - phi : phi;

        this.displacement = amplitude * Math.pow( Math.E, -this.dampingRatio * this.angularFrequency * dt )
                            * Math.sin( this.angularFrequency * dt * Math.sqrt( 1 - Math.pow( this.dampingRatio, 2 ) ) + phi )
                            - gravity / Math.pow( this.angularFrequency, 2 );

        this.mass.verticalVelocity = amplitude * -this.dampingRatio * this.angularFrequency
                                     * Math.pow( Math.E, -this.dampingRatio * this.angularFrequency * dt )
                                     * Math.sin( this.angularFrequency * dt * Math.sqrt( 1 - Math.pow( this.dampingRatio, 2 ) ) + phi )
                                     + amplitude * this.angularFrequency * Math.sqrt( 1 - Math.pow( this.dampingRatio, 2 ) )
                                       * Math.pow( Math.E, -this.dampingRatio * this.angularFrequency * dt )
                                       * Math.cos( this.angularFrequency * dt * Math.sqrt( 1 - Math.pow( this.dampingRatio, 2 ) ) + phi );

        this.mass.positionProperty.set( new Vector2( this.position.x, this.bottomProperty.get() ) );
      }
    }


  } );

} );
