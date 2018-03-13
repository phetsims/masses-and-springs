// Copyright 2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with the reference line nodes.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  // constants
  var LINE_LENGTH = 100;

  /**
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Spring} spring - spring model object
   * @param {Property} property - determines which property is being referenced REVIEW: Property of what? If it can be anything, Property.<*>
   * REVIEW: Use capitalized Property to talk about Properties
   * @param {Property.<boolean>} visibleProperty
   * @param {Object} [options]
   *
   * @constructor
   */
  function ReferenceLineNode( modelViewTransform2, spring, property, visibleProperty, options ) {
    options = _.extend( {
      fixedPosition: false, // flag for a line that remain at a target location
      zeroPointLine: false, // flag for a line that remains at the zero reference point of the sim
      stroke: 'black'
    }, options );

    var self = this;
    Line.call( this, 0, 0, LINE_LENGTH, 0, {
      stroke: options.stroke,
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer'
    } );
    this.mouseArea = this.localBounds.dilatedY( 10 );
    this.touchArea = this.localBounds.dilatedY( 10 );

    //REVIEW: Does not need read-write since it's a local variable
    // {read-write} prevents overlap with the equilibrium line
    var xPos = modelViewTransform2.modelToViewX( spring.positionProperty.get().x );

    // Helper function to derive the length as if the mass wasn't attached.
    var lengthFunction = new LinearFunction( 0.1, 0.5, 1.37, 0.97 );

    var yPos = modelViewTransform2.modelToViewY( lengthFunction( spring.naturalRestingLengthProperty.value ) );

    //REVIEW: Specify read-write as (read-write) AFTER the type docs. Add type docs here.
    // @private {read-write} position of line in screen coordinates.
    this.positionProperty = new Property( new Vector2( xPos, yPos ), {
      phetioType: PropertyIO( Vector2IO )
    } );

    // updates the position of the reference line as the system changes
    Property.multilink( [ spring.massAttachedProperty, spring.naturalRestingLengthProperty, property ],
      function( mass, restingLength, monitoredProperty ) {
      if ( options.zeroPointLine ) {
        return;
      }
      if ( options.fixedPosition || !mass ) {

        // Y position of line in screen coordinates as if a mass isn't attached
        yPos = modelViewTransform2.modelToViewY( lengthFunction( restingLength ) );
      }
      else {

        // Y position of line in screen coordinates with an attached mass
        yPos = modelViewTransform2.modelToViewY( monitoredProperty );
      }
      self.positionProperty.set( new Vector2( xPos, yPos ) );
    } );

    // Link that handles the change in the lines position in screen coordinates
    this.positionProperty.link( function( position ) {
      self.translation = position.minus( new Vector2( LINE_LENGTH / 2, 0 ) );
    } );

    //REVIEW: Use `this` instead of self here?
    visibleProperty.linkAttribute( self, 'visible' );

    //REVIEW: Lots of similarities between this and MovableLineNode. Could be considered to be factored out.

  }

  massesAndSprings.register( 'ReferenceLineNode', ReferenceLineNode );

  return inherit( Line, ReferenceLineNode, {

    /**
     * Resets the position of the line Node.
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );
