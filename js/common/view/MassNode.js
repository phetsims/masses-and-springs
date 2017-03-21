// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );


  /**
   * @param {Mass} mass -  model object
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {MassesAndSpringsScreenView} screenView
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, modelViewTransform2, screenView, model, tandem ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    this.mass = mass;

    var viewBounds = new Bounds2(
      modelViewTransform2.modelToViewDeltaX( -mass.radius ),
      0,
      modelViewTransform2.modelToViewDeltaX( mass.radius ),
      modelViewTransform2.modelToViewDeltaY( -mass.height )
    );
    var rect = Rectangle.bounds( viewBounds, {
      stroke: 'black',
      lineWidth: .5,
      fill: new LinearGradient( viewBounds.minX, 0, viewBounds.maxX, 0 )
        .addColorStop( 0.1, mass.color )
        .addColorStop( 0.2, 'rgb(205,206,207)' )
        .addColorStop( .7, mass.color )
    } );
    this.addChild( rect );
    if ( mass.isLabeled ) {
      var label = new Text( StringUtils.format( massValueString, mass.mass * 1000 ), {
        font: MassesAndSpringsConstants.TITLE_FONT,
        fill: 'black',
        centerY: viewBounds.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: 50,
        tandem: tandem.createTandem( 'label' )
      } );

      var labelBackground = Rectangle.bounds( label.bounds, { fill: '#D3D3D3' } );
      this.addChild( labelBackground );
      this.addChild( label );
    }

    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    var modelOffset;

    self.addInputListener( new TandemSimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      drag: function( event ) {
        var proposedMassPosition = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( modelOffset );
        model.adjustDraggedMassPosition( self.mass, proposedMassPosition );
      },

      start: function( event ) {
        modelOffset = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( self.mass.positionProperty.get() );
        mass.userControlledProperty.set( true );
        self.moveToFront();
      },

      end: function() {
        mass.userControlledProperty.set( false );
      }
    } ) );

  }

  massesAndSprings.register( 'MassNode', MassNode );
  return inherit( Node, MassNode );

} );