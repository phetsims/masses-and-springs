// Copyright 2017-2020, University of Colorado Boulder

/**
 * Responsible for the attributes associated with the reference line nodes.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import massesAndSprings from '../../massesAndSprings.js';

// constants
const LINE_LENGTH = 100;

/**
 * @param {ModelViewTransform2} modelViewTransform2
 * @param {Spring} spring - spring model object
 * @param {Property.<*>} property - determines which Property is being referenced
 * @param {Property.<boolean>} visibleProperty
 * @param {Object} [options]
 *
 * @constructor
 */
function ReferenceLineNode( modelViewTransform2, spring, property, visibleProperty, options ) {
  options = merge( {
    fixedPosition: false, // flag for a line that remain at a target position
    zeroPointLine: false, // flag for a line that remains at the zero reference point of the sim
    stroke: 'black',
    label: null
  }, options );

  const self = this;
  Line.call( this, 0, 0, LINE_LENGTH, 0, {
    stroke: options.stroke,
    lineDash: [ 12, 8 ],
    lineWidth: 1.5,
    cursor: 'pointer',
    pickable: false
  } );
  this.mouseArea = this.localBounds.dilatedY( 10 );
  this.touchArea = this.localBounds.dilatedY( 10 );

  // Prevents overlap with the equilibrium line
  const xPos = modelViewTransform2.modelToViewX( spring.positionProperty.get().x );

  // Helper function to derive the length as if the mass wasn't attached.
  const lengthFunction = new LinearFunction( 0.1, 0.5, 1.37, 0.97 );

  let yPos = modelViewTransform2.modelToViewY( lengthFunction( spring.naturalRestingLengthProperty.value ) );

  // @private (read-write) - position of line in screen coordinates.
  this.positionProperty = new Vector2Property( new Vector2( xPos, yPos ) );

  // Add a label if it exists
  if ( options.label ) {
    this.addChild( options.label );
  }

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

    // Adjust the position of the label
    if ( options.label ) {
      options.label.centerY = 0;
      options.label.x = LINE_LENGTH + 10;
    }
  } );

  visibleProperty.linkAttribute( this, 'visible' );
}

massesAndSprings.register( 'ReferenceLineNode', ReferenceLineNode );

inherit( Line, ReferenceLineNode, {

  /**
   * Resets the position of the line Node.
   *
   * @public
   */
  reset: function() {
    this.positionProperty.reset();
  }
} );

export default ReferenceLineNode;